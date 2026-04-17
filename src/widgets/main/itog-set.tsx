import { useQueryAnalytics } from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { $setting } from "@/shared";
import { LabelFormat, Text, Widget, type WidgetProps } from "@/shared/ui";
import { Group, HoverCard, NumberFormatter } from "@mantine/core";
import dayjs from "dayjs";
import { memo, useEffect, useMemo, useState } from "react";

export interface WidgetMainItogSetProps extends Omit<
	WidgetProps,
	"title" | "children"
> {
	filterdate: IRequestAnalytics["filterdate"];
	event?: IRequestAnalytics["event"];
	title?: WidgetProps["title"];
	type?: "avg" | "min" | "max" | "sum";
}

export const WidgetMainItogSet = memo(
	({
		title,
		type = "sum",
		event = "p",
		filterdate,
		...props
	}: WidgetMainItogSetProps) => {
		const { production_id } = useStoreUserProfile();
		const [query, setQuery] = useState<IRequestAnalytics>({
			filterdate,
			event,
			step: "d",
		});
		const { data, isLoading, error, fetch } = useQueryAnalytics(query);

		let value = useMemo(() => {
			if (!data) {
				return 0;
			}
			return type === "min"
				? data.min_company
				: type === "max"
					? data.max_company
					: type === "avg"
						? Math.round(data.all_records)
						: data.sum_company;
		}, [type, data, production_id]);

		const info = useMemo<
			{
				date: string;
				label: string;
			}[]
		>(() => {
			if (!data || ["avg", "sum"].includes(type)) {
				return [];
			}

			const info: {
				date: string;
				label: string;
			}[] = [];

			data.production.forEach((production) => {
				production.data.forEach((item) => {
					if (item.count === value) {
						if (item.data.length > 10) {
							return;
						}
						info.push({
							date: dayjs(item.timestamp).format($setting.get("formatDate")),
							label: item.data,
						});
					}
				});
			});
			return info;
		}, [value, data, type, production_id]);

		const computedTitle = useMemo(() => {
			if (title) {
				return title;
			}
			if (event === "d") {
				return "Дефект";
			} else if (event === "i") {
				return "Инциденты";
			} else if (event === "v") {
				return "Проверенно";
			}
			return type === "sum" ? "Итого по сериям" : "Cумма всех серий";
		}, [title, type, event]);

		useEffect(() => {
			setQuery((v) => ({
				...v,
				filterdate,
				event,
			}));
		}, [filterdate, event]);

		useEffect(() => {
			fetch();
		}, [query]);

		return (
			<Widget
				error={error}
				loading={isLoading}
				{...props}
				expanded={false}
				title={computedTitle}
				subTitle={
					type === "sum"
						? "Сумма за период"
						: type === "avg"
							? "Среднее значение"
							: type === "min"
								? "Минимальное значение"
								: "Максимальное значение"
				}
			>
				<HoverCard disabled={info.length === 0}>
					<HoverCard.Target>
						<Text fz="3rem" ta="right">
							<NumberFormatter value={value} thousandSeparator=" " />
						</Text>
					</HoverCard.Target>
					<HoverCard.Dropdown>
						{info.map((item) => (
							<Group key={item.date + item.label}>
								<Text>
									<LabelFormat>{item.label}</LabelFormat> -
								</Text>
								<Text>{item.date}</Text>
							</Group>
						))}
					</HoverCard.Dropdown>
				</HoverCard>
			</Widget>
		);
	},
);

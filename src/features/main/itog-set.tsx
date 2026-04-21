import { useStoreUserProfile } from "@/entites/auth";
import { $setting } from "@/shared";
import { LabelFormat, Text } from "@/shared/ui";
import { Group, HoverCard, NumberFormatter } from "@mantine/core";
import dayjs from "dayjs";
import { memo, useEffect, useMemo } from "react";
import { useAnalytics } from "./hooks/use-analytics";

export interface MainItogSetProps {
	filterdate: IRequestAnalytics["filterdate"];
	event?: IRequestAnalytics["event"];
	type?: "avg" | "min" | "max" | "sum";
}

export const MainItogSet = memo(
	({ type = "sum", event = "p", filterdate }: MainItogSetProps) => {
		const { production_id } = useStoreUserProfile();

		const { data, fetch } = useAnalytics({
			filterdate,
			event,
			step: "d",
		});

		let value = useMemo(() => {
			if (!data) {
				return 0;
			}
			return type === "min"
				? (data.min_company ?? 0)
				: type === "max"
					? (data.max_company ?? 0)
					: type === "avg"
						? Math.round(data.all_records ?? 0)
						: (data.sum_company ?? 0);
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

			(data?.production || []).forEach((production) => {
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

		useEffect(() => {
			fetch({
				filterdate,
				event,
			});
		}, [filterdate, event]);

		return (
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
		);
	},
);

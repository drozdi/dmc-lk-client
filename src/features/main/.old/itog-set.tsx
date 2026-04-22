import { useStoreUserProfile } from "@/entites/auth";
import { $setting } from "@/shared";
import { LabelFormat, Text } from "@/shared/ui";
import { Group, HoverCard, NumberFormatter } from "@mantine/core";
import dayjs from "dayjs";
import { Fragment, memo, useEffect, useMemo } from "react";
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
		});

		let value = useMemo(() => {
			if (!data) {
				return 0;
			}
			if (type === "min") {
				let min = data.max_company;
				for (const production of data.production) {
					for (const item of production.data) {
						if (item.data.length > 15) {
							continue;
						}
						min = Math.min(min, item.count);
					}
				}
				return min;
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
				name: string;
				date: string;
				label: string;
			}[]
		>(() => {
			if (!data || ["avg", "sum"].includes(type)) {
				return [];
			}

			const info: {
				name: string;
				date: string;
				label: string;
			}[] = [];

			(data?.production || []).forEach((production) => {
				production.data.forEach((item) => {
					if (item.count === value) {
						if (item.data.length > 15) {
							return;
						}
						info.push({
							date: dayjs(item.timestamp).format($setting.get("formatDate")),
							label: item.data,
							name: production.name as string,
						});
					}
				});
			});
			return info;
		}, [value, data, type, production_id]);

		const groupInfo = useMemo<
			{
				name: string;
				list: {
					name: string;
					date: string;
					label: string;
				}[];
			}[]
		>(() => {
			const group = [...new Set(info.map((item) => item.name.trim()))];
			const list = Object.fromEntries(group.map((name) => [name, []]));
			info.forEach((item) => {
				list[item.name.trim()]?.push({ ...item });
			});
			return Object.entries(list).map(([name, list]) => ({
				name,
				list,
			}));
		}, [info]);

		useEffect(() => {
			fetch({
				filterdate,
				event,
			});
		}, [filterdate, event]);

		return (
			<HoverCard disabled={info.length === 0} width={300}>
				<HoverCard.Target>
					<Text fz="3rem" ta="right">
						<NumberFormatter value={value} />
					</Text>
				</HoverCard.Target>
				<HoverCard.Dropdown>
					{groupInfo.map((item) => (
						<Fragment key={item.name}>
							<Text>{item.name}</Text>
							{item.list.map((item) => (
								<Group key={item.date + item.label} ml="xs">
									<Text>{item.date}</Text>
									<Text>
										<LabelFormat>{item.label}</LabelFormat>
									</Text>
								</Group>
							))}
						</Fragment>
					))}
				</HoverCard.Dropdown>
			</HoverCard>
		);
	},
);

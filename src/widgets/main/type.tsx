import { useQueryAnalytics } from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { LabelFormat, Widget, type WidgetProps } from "@/shared/ui";
import { randomColor } from "@/shared/utils";
import { AspectRatio, Center, Checkbox, Group, Stack } from "@mantine/core";
import dayjs from "dayjs";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

export interface ChartAnalyticProps extends Omit<IRequestAnalytics, "event"> {}

export interface WidgetMainTypeProps extends Omit<WidgetProps, "children"> {
	filterdate: IRequestAnalytics["filterdate"];
}

export const WidgetMainType = memo(
	({ filterdate, step, ...props }: WidgetMainTypeProps) => {
		const { production_id } = useStoreUserProfile();
		const sss = useQueryAnalytics({ filterdate, step: "d", event: "p" });

		// return "";
		const { isLoading, fetch, data, error } = useQueryAnalytics({
			filterdate,
			step: "d",
			event: "p",
		});

		const [filterGap, setFilterGap] = useState<boolean>(true);
		const formatName = useCallback(
			(name: string) => {
				try {
					name = (name || "").toUpperCase().replace(/\./g, "");
					return filterGap ? name.split("G")[0] : name;
				} catch (error) {
					console.error(error);
				}
			},
			[filterGap],
		);
		// Извлекаем список дат
		const labels = useMemo<string[]>(() => {
			const cnt = dayjs(filterdate[1]).diff(filterdate[0], "d");
			const labels: string[] = [];
			const d = dayjs(filterdate[0]);
			for (let i = 0; i <= cnt; i++) {
				labels.push(d.add(i, "d").format("YYYY-MM-DD"));
			}
			return labels;
		}, [filterdate]);

		// Извлекаем, групируем данные
		const ddata = useMemo(() => {
			return [];

			const res: Array<{
				name: string;
				value: number;
				color: string;
			}> = [];
			const currProduction = Number(production_id || 0);

			if (data) {
				labels.forEach((label) => {
					const newItem = {
						name: label,
						value: 0,
						color: randomColor(),
					};
					data.production.forEach((production) => {
						if (
							currProduction > 0 &&
							currProduction !== production.production_id
						) {
							return;
						}
						production.data.forEach((item) => {
							if (formatName(item.data) === label) {
								newItem.value += item.count;
							}
						});
					});

					res.push(newItem);
				});
			}
			return res.filter((item) => item.value > 100);
		}, [data, labels, production_id]);

		const isEmpty = useMemo(() => !ddata.length, [ddata]);

		useEffect(() => {
			fetch();
		}, [filterdate]);

		console.log(data);
		return (
			<Widget {...props} loading={isLoading} title={<>Напечатано за </>}>
				<Stack h="100%">
					<Group gap="0" justify="flex-end">
						<Checkbox
							onChange={(e) => setFilterGap(e.target.checked)}
							checked={filterGap}
							label="Группировать по G"
						/>
					</Group>
					<AspectRatio ratio={16 / 9}>
						{isEmpty ? (
							<Center w="100%" h="100%" fz="h1" c="dimmed">
								Данные ненашлись!
							</Center>
						) : (
							<ResponsiveContainer>
								<BarChart data={ddata}>
									<Tooltip
										labelFormatter={(name) => {
											return <LabelFormat>{name}</LabelFormat>;
										}}
									/>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="name" />
									<YAxis />

									<Bar dataKey="value" fill="#8884d8">
										{ddata.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={entry.color} />
										))}
									</Bar>
								</BarChart>
							</ResponsiveContainer>
						)}
					</AspectRatio>
				</Stack>
			</Widget>
		);
	},
);

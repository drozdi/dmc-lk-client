import { useQueryAnalytics } from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { LabelFormat, Widget, type WidgetProps } from "@/shared/ui";
import { randomColor } from "@/shared/utils";
import { AspectRatio, Center, Checkbox, Group, Stack } from "@mantine/core";
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
import { Filterdate } from "./components/filterdate";

interface ChartAnalyticProps extends Omit<IRequestAnalytics, "event"> {}

interface AnalyticTypeWidgetProps extends WidgetProps, ChartAnalyticProps {}

export const AnalyticTypeWidget = memo(
	({ filterdate, step, ...props }: AnalyticTypeWidgetProps) => {
		const { production_id } = useStoreUserProfile();
		// return "";
		const { isLoading, fetch, data } = useQueryAnalytics();
		const [query, setQuery] = useState<Partial<ChartAnalyticProps>>({
			filterdate,
			step,
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
			let res: string[] = [];
			if (data) {
				for (const p of data?.production || []) {
					res = res.concat(
						((p.data as any) || []).map((item: IAnalyticsDataItem) =>
							formatName(item.data),
						),
					);
				}
			}
			return [...new Set(res)].filter((label) => label.length < 12).sort();
		}, [data, formatName]);
		// Извлекаем, групируем данные
		const ddata = useMemo(() => {
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
			fetch({ ...query, event: "p" });
		}, [query]);

		useEffect(() => {
			setQuery({ filterdate, step });
		}, [filterdate, step]);

		return (
			<Widget
				{...props}
				loading={isLoading}
				title={
					<>
						Напечатано за{" "}
						<Filterdate
							filterdate={query.filterdate}
							editable={!filterdate?.[0]}
							onChange={(filterdate) => {
								setQuery({
									...query,
									filterdate,
								});
							}}
						/>
					</>
				}
			>
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

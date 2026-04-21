import { useEnumsEvents, useQueryAnalytics } from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { Widget, type WidgetProps } from "@/shared/ui";
import { AspectRatio, Box, Center, NumberFormatter } from "@mantine/core";
import { memo, useEffect, useMemo, useState } from "react";
import {
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	type TooltipContentProps,
} from "recharts";
import { Filterdate } from "./ui/filterdate";

const ee = useEnumsEvents();

export interface WidgetLabelsPieProps extends WidgetProps {
	filterdate: IRequestAnalytics["filterdate"];
}

export const WidgetLabelsPie = memo(
	({ filterdate, ...props }: WidgetLabelsPieProps) => {
		const { production_id } = useStoreUserProfile();
		const { isLoading, fetch, error } = useQueryAnalytics();

		const [data, setData] = useState<{
			v?: IResponseAnalytics;
			i?: IResponseAnalytics;
			d?: IResponseAnalytics;
			p?: IResponseAnalytics;
		}>({});

		const [query, setQuery] = useState<Partial<IRequestAnalytics>>({
			filterdate,
			step: "mon",
		});

		async function sendRequest(event: AnalyticEvent) {
			return await fetch({ ...query, event });
		}

		// Извлекаем, групируем данные
		const ddata = useMemo<
			Array<{
				name: string;
				value: number;
				fill: string;
			}>
		>(() => {
			const res = {
				v: { value: 0, color: ee.findColorByCode("v") },
				d: { value: 0, color: ee.findColorByCode("d") },
				i: { value: 0, color: ee.findColorByCode("i") },
			} as Record<
				AnalyticEvent,
				{
					value: number;
					color: string;
				}
			>;

			const currProduction = Number(production_id) || 0;

			if (data) {
				for (const event in res) {
					res[event as AnalyticEvent].value = Number(
						data[event as AnalyticEvent]?.sum_company,
					);
				}
			}

			return Object.entries(res).map(([name, { value, color }]) => ({
				name: ee.findLabelByCode(name as AnalyticEvent),
				value,
				fill: color,
			}));
		}, [data, production_id]);

		const isEmpty = useMemo(
			() => !ddata.reduce((acc, { value }) => acc && value > 0, true),
			[ddata],
		);

		const total = useMemo(
			() => ddata.reduce((a, b) => a + b.value, 0),
			[ddata],
		);

		useEffect(() => {
			(async function () {
				setData({
					v: await sendRequest("v"),
					i: await sendRequest("i"),
					d: await sendRequest("d"),
					p: await sendRequest("p"),
				});
			})();
		}, [query]);

		useEffect(() => {
			setQuery((v) => ({ ...v, filterdate }));
		}, [filterdate]);

		return (
			<Widget
				error={error}
				loading={isLoading}
				{...props}
				title={
					<>
						Соотношение за{" "}
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
				<AspectRatio ratio={16 / 9} h="100%">
					{isEmpty ? (
						<Center w="100%" h="100%" fz="h1" c="dimmed">
							Данные ненашлись!
						</Center>
					) : (
						<ResponsiveContainer>
							<PieChart>
								<Tooltip
									content={(arg: TooltipContentProps) => {
										const { separator, payload } = arg;
										const entity = payload[0]?.payload;
										if (!entity) {
											return null;
										}
										return (
											<Box
												bg="var(--mantine-color-body)"
												bd="1px solid var(--mantine-color-default-border)"
												p="xs"
											>
												<span style={{ color: entity.fill }}>
													{entity.name}
												</span>{" "}
												{separator} <NumberFormatter value={entity.value} />
											</Box>
										);
									}}
								/>
								<Legend
									formatter={(_: string, entry: any) => {
										const { color, name, value } = entry.payload;
										return <span style={{ color }}>{name}</span>;
									}}
									layout="vertical"
									verticalAlign="middle"
									align="left"
								/>

								<Pie data={ddata} dataKey="value" cx="50%" cy="50%" />
							</PieChart>
						</ResponsiveContainer>
					)}
				</AspectRatio>
			</Widget>
		);
	},
);

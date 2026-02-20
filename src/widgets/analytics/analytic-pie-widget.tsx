import { useEnumsEvents, useQueryAnalytics } from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { ExpandablePanel } from "@/shared/ui";
import { round } from "@/shared/utils";
import { AspectRatio, Stack } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import {
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
import { Filterdate } from "./components/filterdate";

const ee = useEnumsEvents();

interface ChartAnalyticProps extends Omit<IRequestAnalytics, "event"> {}

export const AnalyticPieWidget = (props: ChartAnalyticProps) => {
	const { production_id } = useStoreUserProfile();
	const { isLoading, fetch } = useQueryAnalytics();
	//return ''

	const [data, setData] = useState<{
		v?: IResponseAnalytics;
		i?: IResponseAnalytics;
		d?: IResponseAnalytics;
		p?: IResponseAnalytics;
	}>({});
	const [query, setQuery] = useState<ChartAnalyticProps>({ ...props });

	async function sendRequest(event: AnalyticEvent) {
		return await fetch({ ...query, event });
	}

	// Извлекаем, групируем данные
	const ddata = useMemo(() => {
		const res = {
			v: { value: 0, color: ee.findColorByCode("v") },
			d: { value: 0, color: ee.findColorByCode("d") },
			i: { value: 0, color: ee.findColorByCode("i") },
		};
		const currProduction = Number(production_id) || 0;

		if (data) {
			for (const event in res) {
				if (currProduction > 0) {
					res[event as "v" | "i" | "d"].value =
						data?.[event as AnalyticEvent]?.production?.find(
							(item) => item.production_id === currProduction,
						)?.all_label_prod || 0;
				} else {
					res[event as "v" | "i" | "d"].value = Number(
						data[event as AnalyticEvent]?.sum_company,
					);
				}
			}
		}

		return Object.entries(res).map(([name, { value, color }]) => ({
			name: ee.findLabelByCode(name as AnalyticEvent),
			value,
			color,
		}));
	}, [data, production_id]);
	const isEmpty = useMemo(() => !ddata.length, [ddata]);

	const total = useMemo(
		() => ddata.reduce((a, b) => a + b.value, 0),
		[ddata],
	);

	useEffect(() => {
		const send = async () => {
			setData({
				v: await sendRequest("v"),
				i: await sendRequest("i"),
				d: await sendRequest("d"),
				p: await sendRequest("p"),
			});
		};
		send();
	}, [query]);
	useEffect(() => {
		setQuery(props);
	}, [props]);

	return (
		<ExpandablePanel
			loading={isLoading}
			title={
				<Filterdate
					filterdate_from={query.filterdate_from}
					filterdate_to={query.filterdate_to}
					editable={!Boolean(props.filterdate_from)}
					onChange={(val) => {
						setQuery({
							...query,
							filterdate_from: val[0] || "",
							filterdate_to: val[1] || "",
						});
					}}
				/>
			}
		>
			<Stack h="100%">
				<AspectRatio ratio={16 / 9}>
					{isEmpty ? (
						<span>Данные ненашлись!</span>
					) : (
						<ResponsiveContainer>
							<PieChart>
								<Tooltip />
								<Legend
									formatter={(_: string, entry: any) => {
										const { color, name, value } =
											entry.payload;
										return (
											<span style={{ color }}>
												{name} - {value} (
												{String(
													round(
														value / total,
														10000,
													) * 100,
												).substring(0, 5)}
												%)
											</span>
										);
									}}
									layout="vertical"
									verticalAlign="middle"
									align="left"
								/>
								<Pie
									data={ddata}
									cx="50%"
									cy="50%"
									fill="#8884d8"
									dataKey="value"
								>
									{ddata.map((entry) => (
										<Cell
											key={`cell-${entry.name}`}
											fill={entry.color}
										/>
									))}
								</Pie>
							</PieChart>
						</ResponsiveContainer>
					)}
				</AspectRatio>
			</Stack>
		</ExpandablePanel>
	);
};

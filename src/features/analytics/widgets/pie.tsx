import {
	corectQuery,
	useEnumsEvents,
	useQueryAnalytics,
} from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { LegendContentPie, TooltipContentPie } from "@/shared/ui";
import { AspectRatio, Center } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const ee = useEnumsEvents();

export interface AnalyticPieProps {
	filterdate: IRequestAnalytics["filterdate"];
	events?: AnalyticEvent[];
	percent?: boolean;
}

export const AnalyticPie = ({
	filterdate,
	events = ["v", "d", "i"],
	percent
}: AnalyticPieProps) => {
	const production_id = Number(
		useStoreUserProfile((state) => state.production_id) || 0,
	);
	const [query, setQuery] = useState<IRequestAnalytics>(
		corectQuery({
			filterdate,
			production_id,
		} as IRequestAnalytics),
	);

	const { fetch } = useQueryAnalytics(query);

	const [data, setData] = useState<{
		v?: IResponseAnalytics;
		i?: IResponseAnalytics;
		d?: IResponseAnalytics;
		p?: IResponseAnalytics;
	}>({});

	// Извлекаем, групируем данные
	const ddata = useMemo<
		Array<{
			event: AnalyticEvent;
			name: string;
			value: number;
			fill: string;
		}>
	>(() => {
		const res = Object.fromEntries(
			events.map((event) => [
				event,
				{
					value: 0,
					color: ee.findColorByCode(event),
				},
			]),
		) as Record<
			AnalyticEvent,
			{
				value: number;
				color: string;
			}
		>;
		if (data) {
			for (const event in res) {
				res[event as AnalyticEvent].value = Number(
					data[event as AnalyticEvent]?.sum_company || 0,
				);
			}
		}

		return Object.entries(res).map(([name, { value, color }]) => ({
			event: name as AnalyticEvent,
			name: ee.findLabelByCode(name as AnalyticEvent),
			value,
			fill: color,
		}));
	}, [data, events, production_id]);

	const isEmpty = useMemo(
		() => !ddata.reduce((acc, { value }) => acc && value > 0, true),
		[ddata],
	);

	useEffect(() => {
		(async function () {
			setData({
				v: await fetch({ ...query, event: "v" }),
				i: await fetch({ ...query, event: "i" }),
				d: await fetch({ ...query, event: "d" }),
				p: await fetch({ ...query, event: "p" }),
			});
		})();
	}, [query]);


	const total = useMemo(() => ddata.reduce((acc, item) => acc + item.value, 0), [ddata])

	useEffect(() => {
		setQuery((v) => ({ ...v, filterdate }));
	}, [filterdate]);
	
	const formatter = (value: number) => percent? Math.round(value / total *100) + '%': value

	return (
		<AspectRatio ratio={16 / 9} h="100%">
			{isEmpty ? (
				<Center w="100%" h="100%" fz="h1" c="dimmed">
					Данные ненашлись!
				</Center>
			) : (
				<ResponsiveContainer>
					<PieChart>
						<Tooltip content={TooltipContentPie} formatter={formatter} />
						<Legend
							layout="vertical"
							verticalAlign="bottom"
							align="left"
							content={LegendContentPie}
							formatter={formatter}
						/>

						<Pie data={ddata} dataKey="value" cx="50%" cy="50%" />
					</PieChart>
				</ResponsiveContainer>
			)}
		</AspectRatio>
	);
};

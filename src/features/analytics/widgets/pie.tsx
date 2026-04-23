import {
	corectQuery,
	useEnumsEvents,
	useQueryAnalytics,
} from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { AspectRatio, Box, Center, NumberFormatter } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import {
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	type TooltipContentProps,
} from "recharts";

const ee = useEnumsEvents();

export interface AnalyticPieProps {
	filterdate: IRequestAnalytics["filterdate"];
	events?: AnalyticEvent[];
}

export const AnalyticPie = ({
	filterdate,
	events = ["v", "d", "i"],
}: AnalyticPieProps) => {
	const { production_id } = useStoreUserProfile();
	const { fetch } = useQueryAnalytics();

	const [data, setData] = useState<{
		v?: IResponseAnalytics;
		i?: IResponseAnalytics;
		d?: IResponseAnalytics;
		p?: IResponseAnalytics;
	}>({});

	const [query, setQuery] = useState<IRequestAnalytics>(
		corectQuery({
			filterdate,
		} as IRequestAnalytics),
	);

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

		const currProduction = Number(production_id || 0);

		if (data) {
			for (const event in res) {
				res[event as AnalyticEvent].value = Number(
					data[event as AnalyticEvent]?.sum_company,
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

	const total = useMemo(() => ddata.reduce((a, b) => a + b.value, 0), [ddata]);

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

	useEffect(() => {
		setQuery((v) => ({ ...v, filterdate }));
	}, [filterdate]);

	return (
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
										<span style={{ color: entity.fill }}>{entity.name}</span>{" "}
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
	);
};

import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ReferenceArea,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import { useEnumsEvents, useQueryAnalytics } from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { Widget } from "@/shared/ui";
import { AspectRatio, Stack } from "@mantine/core";
import { Filterdate } from "./components/filterdate";

const ee = useEnumsEvents();

interface ChartAnalyticProps extends Omit<IRequestAnalytics, "event"> {}

const initialState = {
	refAreaLeft: "",
	refAreaRight: "",
	animation: true,
};

export const AnalyticEventWidget = (props: Partial<ChartAnalyticProps>) => {
	const { production_id } = useStoreUserProfile();
	const { isLoading, fetch, error } = useQueryAnalytics();

	// return "";

	const [data, setData] = useState<{
		v?: IResponseAnalytics;
		i?: IResponseAnalytics;
		d?: IResponseAnalytics;
		p?: IResponseAnalytics;
	}>();

	const [query, setQuery] = useState<Partial<ChartAnalyticProps>>({
		...props,
	});

	async function sendRequest(event: AnalyticEvent) {
		return await fetch({ ...query, event });
	}

	// Извлекаем список дат
	const labels = useMemo<string[]>(() => {
		let res: string[] = [];
		if (data) {
			for (const event in ee.data) {
				for (const p of data[event as AnalyticEvent]?.production || []) {
					res = res.concat(p.data.map((item) => item.timestamp));
				}
			}
		}
		return [...new Set(res)].sort();
	}, [data]);
	// Извлекаем, групируем данные
	const ddata = useMemo(() => {
		const initialData = Object.fromEntries(
			labels.map((item) => [
				item,
				Object.fromEntries(Object.keys(ee.data).map((item) => [item, 0])),
			]),
		);
		const currProduction = Number(production_id || 0);
		for (const event in ee.data) {
			if (!data?.[event as AnalyticEvent]?.production) {
				continue;
			}
			for (const p of data?.[event as AnalyticEvent]?.production || []) {
				if (currProduction > 0 && p.production_id !== currProduction) {
					continue;
				}
				(p.data as any[]).forEach((item) => {
					initialData[item.timestamp][event] += item.count;
				});
			}
		}
		return Object.entries(initialData).map(([name, data]) => ({
			...data,
			name,
		}));
	}, [data, labels, production_id]);

	const isEmpty = useMemo(() => !ddata.length, [ddata]);

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

	const stepLow = (from: string, to: string) => {
		const dFrom = dayjs(from);
		const dTo = dayjs(to);

		let d = dTo.diff(dFrom) / 1000 / 60 / 60 / 24;

		if (d > 60) {
			setQuery({
				...query,
				step: "mon",
				filterdate: [dFrom.format("YYYY-MM-DD"), dTo.format("YYYY-MM-DD")],
			});
		} else if (d > 7) {
			setQuery({
				...query,
				step: "d",
				filterdate: [dFrom.format("YYYY-MM-DD"), dTo.format("YYYY-MM-DD")],
			});
		} else {
			d *= 24;
			if (d > 24) {
				setQuery({
					...query,
					step: "h",
					filterdate: [
						dFrom.format("YYYY-MM-DD HH:mm"),
						dTo.format("YYYY-MM-DD HH:mm"),
					],
				});
			} else {
				d *= 60;
				if (d > 60) {
					setQuery({
						...query,
						step: "m",
						filterdate: [
							dFrom.format("YYYY-MM-DD HH:mm:ss"),
							dTo.format("YYYY-MM-DD HH:mm:ss"),
						],
					});
				} else {
					d *= 60;
					setQuery({
						...query,
						step: "s",
						filterdate: [
							dFrom.format("YYYY-MM-DD HH:mm:ss"),
							dTo.format("YYYY-MM-DD HH:mm:ss"),
						],
					});
				}
			}
		}
	};

	const [state, setState] = useState<{
		refAreaLeft: string | number;
		refAreaRight: string | number;
		animation: boolean;
	}>(initialState);
	const { refAreaLeft, refAreaRight } = state;

	const handleMouseDown = (event: any) => {
		setState((prevState) => ({
			...prevState,
			refAreaLeft: event.activeLabel,
		}));
	};
	const handleMouseMove = (event: any) => {
		state.refAreaLeft &&
			setState((prevState) => ({
				...prevState,
				refAreaRight: event.activeLabel,
			}));
	};
	const handleMouseUp = (event: any) => {
		let { refAreaLeft, refAreaRight } = state;

		if (refAreaLeft === refAreaRight || refAreaRight === "") {
			setState((prevState) => ({
				...prevState,
				refAreaLeft: "",
				refAreaRight: "",
			}));
			return;
		}

		if (refAreaLeft > refAreaRight) {
			[refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];
		}

		stepLow(refAreaLeft as string, refAreaRight as string);
		setState((prevState) => ({
			...prevState,
			refAreaLeft: "",
			refAreaRight: "",
		}));
	};

	return (
		<Widget
			dragable
			title={
				<Filterdate
					filterdate={query.filterdate}
					editable={!props.filterdate?.[0]}
					onChange={(filterdate) => {
						setQuery({
							...query,
							filterdate,
						});
					}}
				/>
			}
			loading={isLoading}
		>
			<Stack h="100%">
				<AspectRatio ratio={16 / 9}>
					{isEmpty ? (
						<span>Данные ненашлись!</span>
					) : (
						<ResponsiveContainer>
							<LineChart
								data={ddata}
								onMouseDown={handleMouseDown}
								onMouseMove={handleMouseMove}
								onMouseUp={handleMouseUp}
							>
								<CartesianGrid stroke="#aaa" strokeDasharray="5 5" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Line
									name={ee.findLabelByCode("d")}
									type="monotone"
									dataKey="d"
									stroke={ee.findColorByCode("d")}
									label={ee.findLabelByCode("d") as any}
								/>
								<Line
									name={ee.findLabelByCode("i")}
									type="monotone"
									dataKey="i"
									stroke={ee.findColorByCode("i")}
									label={ee.findLabelByCode("i") as any}
								/>
								<Line
									name={ee.findLabelByCode("v")}
									type="monotone"
									dataKey="v"
									stroke={ee.findColorByCode("v")}
									label={ee.findLabelByCode("v") as any}
								/>
								{refAreaLeft && refAreaRight ? (
									<ReferenceArea
										x1={refAreaLeft}
										x2={refAreaRight}
										strokeOpacity={0.3}
									/>
								) : null}
							</LineChart>
						</ResponsiveContainer>
					)}
				</AspectRatio>
			</Stack>
		</Widget>
	);
};

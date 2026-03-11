import { useEnumsEvents, useQueryAnalytics } from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { $setting } from "@/shared";
import { Widget, type WidgetProps } from "@/shared/ui";
import { Table } from "@mantine/core";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filterdate } from "./components/filterdate";

const nDow = dayjs();
const sDay = nDow.day(-7);

interface AnalyticAnalyticWidgetProps
	extends WidgetProps, Partial<IRequestAnalytics> {}

export const AnalyticAnalyticWidget = ({
	filterdate,
	step = "d",
	...props
}: AnalyticAnalyticWidgetProps) => {
	const { production_id } = useStoreUserProfile();
	const [query, setQuery] = useState<Partial<IRequestAnalytics>>({
		filterdate: [sDay.format("YYYY-MM-DD"), nDow.format("YYYY-MM-DD")],
		step,
	});

	const ee = useEnumsEvents();
	const maps = Object.keys(ee.data) as AnalyticEvent[];

	const navigate = useNavigate();
	const { isLoading, error, fetch } = useQueryAnalytics(query);
	const [data, setData] = useState<{
		v?: IResponseAnalytics;
		i?: IResponseAnalytics;
		d?: IResponseAnalytics;
		p?: IResponseAnalytics;
	}>({});

	useEffect(() => {
		const send = async () => {
			setData({
				v: await fetch({ event: "v" }),
				i: await fetch({ event: "i" }),
				d: await fetch({ event: "d" }),
				p: await fetch({ event: "p" }),
			});
		};
		send();
	}, []);

	const ddata = useMemo(() => {
		const res: Record<string, any> = {};
		const def = Object.fromEntries(maps.map((key) => [key, 0]));
		for (let i = 0; i < 7; i++) {
			res[sDay.day(sDay.day() + i).format("YYYY-MM-DD") as string] = {
				...def,
			};
		}
		const currProduction = Number(production_id) || 0;

		if (data) {
			for (const event of maps) {
				for (const production of data[event as AnalyticEvent]?.production ||
					[]) {
					if (
						currProduction > 0 &&
						production.production_id === currProduction
					) {
						continue;
					}
					for (const d of production.data || []) {
						res[dayjs(d.timestamp).format("YYYY-MM-DD")][event] += d.count;
					}
				}
			}
		}

		return Object.entries(res).map(([label, value]) => ({
			...value,
			label,
		}));
	}, [data, production_id]);

	const isEmpty = useMemo(() => !ddata.length, [ddata]);

	return (
		<Widget
			{...props}
			loading={isLoading}
			title={
				<>
					Этикетки за{" "}
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
			<Table>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Дата</Table.Th>
						{maps.map((key) => (
							<Table.Th key={key}>{ee.findLabelByCode(key)}</Table.Th>
						))}
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{ddata.map(({ label, ...values }) => (
						<Table.Tr
							key={label}
							onClick={() =>
								navigate(
									`/analytics/incident/?from=${dayjs(label).format("YYYY-MM-DD")}&to=${dayjs(
										label,
									)
										.day(dayjs(label).day() + 1)
										.format("YYYY-MM-DD")}`,
								)
							}
							style={{ cursor: "pointer" }}
						>
							<Table.Td>
								{dayjs(label).format($setting.get("formatDate"))}
							</Table.Td>
							{maps.map((key) => (
								<Table.Td key={key}>{values[key]}</Table.Td>
							))}
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
		</Widget>
	);
};

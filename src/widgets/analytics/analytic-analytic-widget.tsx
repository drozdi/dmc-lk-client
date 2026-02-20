import { useEnumsEvents, useQueryAnalytics } from "@/entites/analytics";
import { ExpandablePanel } from "@/shared/ui";
import { Select, Table } from "@mantine/core";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const nDow = dayjs("2025-05-02");
const sDay = nDow.day(nDow.day() - 7);

export const AnalyticAnalyticWidget = () => {
	const ee = useEnumsEvents();
	const maps = Object.keys(ee.data) as AnalyticEvent[];

	const navigate = useNavigate();
	const { isLoading, error, fetch } = useQueryAnalytics({
		filterdate_from: sDay.format("YYYY-MM-DD"),
		filterdate_to: nDow.format("YYYY-MM-DD"),
		step: "d",
	});
	const [data, setData] = useState<{
		v?: IResponseAnalytics;
		i?: IResponseAnalytics;
		d?: IResponseAnalytics;
		p?: IResponseAnalytics;
	}>({});
	const [cuurent_production, setCurrentProduction] = useState("0");

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
	const productions = useMemo<IAnalyticsProductionSelect[]>(() => {
		const productions: IAnalyticsProductionSelect[] = [];
		if (data) {
			for (const event in ee.data) {
				data[event as AnalyticEvent]?.production?.forEach(
					(item: IAnalyticsDataProduction) => {
						if (
							productions.findIndex(
								(production) =>
									production.value ===
									String(item.production_id),
							) === -1
						) {
							productions.push({
								value: String(item.production_id),
								label: item.name,
							});
						}
					},
				);
			}
		}
		return productions;
	}, [data]);

	const ddata = useMemo(() => {
		const res: Record<string, any> = {};
		const def = Object.fromEntries(maps.map((key) => [key, 0]));
		for (let i = 0; i < 7; i++) {
			res[sDay.day(sDay.day() + i).format("YYYY-MM-DD") as string] = {
				...def,
			};
		}
		const currProduction = Number(cuurent_production) || 0;

		if (data) {
			for (let event of maps) {
				for (let production of data[event as AnalyticEvent]
					?.production || []) {
					if (
						currProduction > 0 &&
						production.production_id === currProduction
					) {
						continue;
					}
					for (let d of production.data || []) {
						res[dayjs(d.timestamp).format("YYYY-MM-DD")][event] +=
							d.count;
					}
				}
			}
		}

		return Object.entries(res).map(([label, value]) => ({
			...value,
			label,
		}));
	}, [data, cuurent_production]);

	const isEmpty = useMemo(() => !ddata.length, [ddata]);

	return (
		<ExpandablePanel
			loading={isLoading}
			title={`Отчет c ${sDay.format("YYYY-MM-DD")} по ${nDow.day(nDow.day() - 1).format("YYYY-MM-DD")}`}
		>
			<Select
				defaultValue={String(cuurent_production)}
				checkIconPosition="right"
				onChange={(val) => setCurrentProduction(val as string)}
				data={[
					{
						value: "0",
						label: "Все площадки",
					},
				].concat(productions as any)}
			/>
			<Table>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Дата</Table.Th>
						{maps.map((key) => (
							<Table.Th key={key}>
								{ee.findLabelByCode(key)}
							</Table.Th>
						))}
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{ddata.map(({ label, ...values }) => (
						<Table.Tr
							key={label}
							onClick={() =>
								navigate(`/analytics/incident/day?day=${label}`)
							}
							style={{ cursor: "pointer" }}
						>
							<Table.Td>{label}</Table.Td>
							{maps.map((key) => (
								<Table.Td key={key}>{values[key]}</Table.Td>
							))}
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
		</ExpandablePanel>
	);
};

import { useEnumsEvents, useQueryAnalytics } from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { Widget } from "@/shared/ui";
import { Table } from "@mantine/core";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filterdate } from "./components/filterdate";

const nDow = dayjs("2025-05-02");
const sDay = nDow.day(nDow.day() - 7);

export const AnalyticAnalyticWidget = (props: Partial<IRequestAnalytics>) => {
	const { production_id } = useStoreUserProfile();
	const [query, setQuery] = useState<Partial<IRequestAnalytics>>({
		filterdate_from: sDay.format("YYYY-MM-DD"),
		filterdate_to: nDow.format("YYYY-MM-DD"),
		step: "d",
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
	}, [data, production_id]);

	const isEmpty = useMemo(() => !ddata.length, [ddata]);

	return (
		<Widget
			dragable
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
		</Widget>
	);
};

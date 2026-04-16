import { useQueryAnalytics } from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { $setting } from "@/shared";
import { Widget, type WidgetProps } from "@/shared/ui";
import { labelName } from "@/shared/utils";
import { NumberFormatter, Table, TableTr } from "@mantine/core";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";

export interface WidgetMainCountProps extends Omit<
	WidgetProps,
	"title" | "children"
> {
	filterdate: IRequestAnalytics["filterdate"];
	event?: IRequestAnalytics["event"];
	title?: WidgetProps["title"];
}

export const WidgetMainCount = ({
	title,
	event = "p",
	filterdate,
	...props
}: WidgetMainCountProps) => {
	const { production_id } = useStoreUserProfile();
	const [query, setQuery] = useState<IRequestAnalytics>({
		filterdate,
		event,
		step: "d",
	});

	const { data, isLoading, error, fetch } = useQueryAnalytics(query);

	const ddata = useMemo<
		Array<{
			date: string;
			total: number;
			[key: string]: string | number;
		}>
	>(() => {
		if (!data?.production?.length) {
			return [];
		}
		const d = dayjs(query.filterdate[0]);
		const cnt = dayjs(query.filterdate[1]).diff(query.filterdate[0], "d");
		const ddata: Record<string, Record<string, number>> = {};
		const currProduction = Number(production_id || 0);

		for (let i = 0; i <= cnt; i++) {
			ddata[d.add(i, "d").format("YYYY-MM-DD")] = {
				total: 0,
			};
		}

		for (const item of data.production) {
			if (currProduction > 0 && currProduction !== item.production_id) {
				continue;
			}
			for (const elem of item.data) {
				if (elem.data.length > 10) {
					continue;
				}
				const date = dayjs(elem.timestamp).format("YYYY-MM-DD");
				const label = labelName(elem.data);
				ddata[date] = ddata[date] || {
					total: 0,
				};
				ddata[date][label] = (ddata[date][label] || 0) + elem.count;
			}
		}

		return Object.entries(ddata)
			.sort((a, b) => a[0].localeCompare(b[0]))
			.map(([date, v]) => ({
				...v,
				date,
				total: Object.values(v).reduce((a, b) => a + b, 0),
			}));
	}, [query, data]);

	const header = useMemo<string[]>(() => {
		const header: string[] = [];
		ddata.forEach(({ date, total, ...item }) => {
			header.push(...Object.keys(item));
		});
		return [...new Set(header)];
	}, [ddata]);

	useEffect(() => {
		setQuery((v) => ({
			...v,
			filterdate,
			event,
		}));
	}, [filterdate, event]);
	useEffect(() => {
		fetch();
	}, [query]);

	const computedTitle = useMemo(() => {
		if (title) {
			return title;
		}
		if (event === "d") {
			return "Дефект";
		} else if (event === "i") {
			return "Инциденты";
		} else if (event === "v") {
			return "Проверенно";
		}
		return "Напечатано";
	}, [title, event]);

	return (
		<Widget
			error={error}
			loading={isLoading}
			{...props}
			expanded={false}
			title={computedTitle}
			subTitle={`${dayjs(query.filterdate[0]).format($setting.get("formatDate"))} - ${dayjs(query.filterdate[1]).format($setting.get("formatDate"))}`}
		>
			<Table>
				<Table.Thead>
					<TableTr>
						<Table.Th>Дата</Table.Th>
						{header.map((label) => (
							<Table.Th key={label}>{label}</Table.Th>
						))}
						<Table.Th>Количество</Table.Th>
					</TableTr>
				</Table.Thead>
				<Table.Tbody>
					{ddata.map((tr) => (
						<Table.Tr key={tr.date}>
							<Table.Td>
								{dayjs(tr.date).format($setting.get("formatDate"))}
							</Table.Td>
							{header.map((label) => (
								<Table.Td key={label}>
									<NumberFormatter value={tr[label]} thousandSeparator=" " />
								</Table.Td>
							))}
							<Table.Td>
								<NumberFormatter value={tr.total} thousandSeparator=" " />
							</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
		</Widget>
	);
};

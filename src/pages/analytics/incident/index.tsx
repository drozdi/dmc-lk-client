import {
	useEnumsDetails,
	useEnumsFields,
} from "@/entites/analytics";
import { IncidentDetail } from "@/features/analytics/incident/detail";
import { IncidentGenerate } from "@/features/analytics/incident/generate";
import { Template } from "@/layout";
import { $setting } from "@/shared";
import { useQueryLoading } from "@/shared/hooks";
import { DualCalendarRange } from "@/shared/ui";
import { Button, Group, Paper, Tabs } from "@mantine/core";
import { type DateValue } from "@mantine/dates";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function AnalyticsIncidentPage() {
	const [searchParams] = useSearchParams();

	const fromDay = dayjs(
		searchParams.get("from") || dayjs().subtract(7, "day"),
	);
	const toDay = dayjs(searchParams.get("to") || dayjs());
	const initialDataFilters = useMemo(
		() => searchParams.getAll("data").filter(Boolean),
		[searchParams],
	);
	const defaultTab = searchParams.get("tab") === "generate" ? "generate" : "detail";

	const [filterdate, setFilterdate] = $setting.useState<[DateValue, DateValue]>(
		"incident.filterdate",
		[fromDay.format("YYYY-MM-DD"), toDay.format("YYYY-MM-DD")],
	);
	const [activeTab, setActiveTab] = useState(defaultTab);
	const [tabLoading, setTabLoading] = useState(false);

	const handleChange = (filterdate: [DateValue, DateValue]) => {
		if (filterdate[0] && filterdate[1]) {
			setFilterdate(filterdate);
		}
	};

	useEffect(() => {
		if (searchParams.get("from")) {
			setFilterdate([fromDay.format("YYYY-MM-DD"), toDay.format("YYYY-MM-DD")]);
		}
	}, [searchParams, fromDay, toDay]);

	useEffect(() => {
		setActiveTab(defaultTab);
	}, [defaultTab]);

	const ef = useEnumsFields();
	const ed = useEnumsDetails();

	const isLoading = useQueryLoading(ef, ed) || tabLoading;

	const handleYesterday = () => {
		setFilterdate([
			dayjs().subtract(1, "day").format("YYYY-MM-DD"),
			dayjs().format("YYYY-MM-DD"),
		]);
	};
	const handleWeek = () => {
		setFilterdate([
			dayjs().subtract(7, "day").format("YYYY-MM-DD"),
			dayjs().format("YYYY-MM-DD"),
		]);
	};
	const handleMonth = () => {
		const filterdate: [DateValue, DateValue] = [
			dayjs().subtract(28, "day").format("YYYY-MM-DD"),
			dayjs().format("YYYY-MM-DD"),
		];
		setFilterdate(filterdate);
	};

	return (
		<Paper>
			<Template.Title>Журнал инцидентов</Template.Title>
			<Group justify="space-between">
				<Group>
					<Button loading={isLoading} onClick={handleYesterday}>
						Вчера
					</Button>
					<Button loading={isLoading} onClick={handleWeek}>
						Неделя
					</Button>
					<Button loading={isLoading} onClick={handleMonth}>
						Месяц
					</Button>
				</Group>
				<DualCalendarRange value={filterdate} onChange={handleChange} />
			</Group>
			<Tabs value={activeTab} onChange={(value) => value && setActiveTab(value)} mt="xs">
				<Tabs.List>
					<Tabs.Tab value="detail">Кратко</Tabs.Tab>
					<Tabs.Tab value="generate">Детально</Tabs.Tab>
				</Tabs.List>
				{activeTab === "detail" ? (
					<Tabs.Panel value="detail">
						<IncidentDetail filterdate={filterdate} onLoading={setTabLoading} />
					</Tabs.Panel>
				) : (
					<Tabs.Panel value="generate">
						<IncidentGenerate
							filterdate={filterdate}
							initialDataFilters={initialDataFilters}
							onLoading={setTabLoading}
						/>
					</Tabs.Panel>
				)}
			</Tabs>
		</Paper>
	);
}

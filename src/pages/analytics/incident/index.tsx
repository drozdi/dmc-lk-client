import {
	useEnumsDetails,
	useEnumsFields,
	useQueryIncident
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
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export function AnalyticsIncidentPage() {
	const [searchParams] = useSearchParams();

	const fromDay = dayjs(searchParams.get("from") || dayjs().day(dayjs().day() - 7));
	const toDay = dayjs(searchParams.get("to") || fromDay.day(fromDay.day() + 7));

	const [filterdate, setFilterdate] = $setting.useState<[DateValue, DateValue]>(
		"incident.filterdate",
		[fromDay.format("YYYY-MM-DD"), toDay.format("YYYY-MM-DD")],
	);

	const handleChange = (filterdate: [DateValue, DateValue]) => {
		if (filterdate[0] && filterdate[1]) {
			setFilterdate(filterdate);
		}
	};

	useEffect(() => {
		if (searchParams.get("from")) {
			setFilterdate([fromDay.format("YYYY-MM-DD"), toDay.format("YYYY-MM-DD")]);
		}
	}, []);

	const ef = useEnumsFields();
	const ed = useEnumsDetails();
	const qi = useQueryIncident();

	const isLoading = useQueryLoading(qi, ef, ed);

	const handleYesterday = () => {
		setFilterdate([
			dayjs().day(-1).format("YYYY-MM-DD"),
			dayjs().format("YYYY-MM-DD"),
		]);
	};
	const handleWeek = () => {
		setFilterdate([
			dayjs().day(-7).format("YYYY-MM-DD"),
			dayjs().format("YYYY-MM-DD"),
		]);
	};
	const handleMonth = () => {
		const filterdate: [DateValue, DateValue] = [
			dayjs().day(-28).format("YYYY-MM-DD"),
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
			<Tabs defaultValue={searchParams.get("tab") === 'generate'? 'generate': "detail"} mt="xs">
				<Tabs.List>
					<Tabs.Tab value="detail">Кратко</Tabs.Tab>
					<Tabs.Tab value="generate">Детально</Tabs.Tab>
				</Tabs.List>
				<Tabs.Panel value="detail">
					<IncidentDetail filterdate={filterdate} />
				</Tabs.Panel>
				<Tabs.Panel value="generate">
					<IncidentGenerate filterdate={filterdate} />
				</Tabs.Panel>
			</Tabs>
		</Paper>
	);
}

import { DashboardProvider, UiDashBoard } from "@/entites/dashboard";
import { useStoreDashboardMain } from "@/entites/dashboard/stores/use-store-dashboard-main";
import { AddWidget } from "@/features/dashboard/add-widget";
import { BtnClear } from "@/features/dashboard/btn-clear";
import {
	AnalyticAnalyticWidget,
	AnalyticEventWidget,
	AnalyticPieWidget,
	AnalyticTypeWidget,
} from "@/widgets/analytics";
import { CountWidget } from "@/widgets/count-widget";
import { Group, Paper, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Template } from "@t";
import dayjs from "dayjs";
import { useState } from "react";

const dNow = dayjs("2025-05-02");

export const DashboardPage = () => {
	const [query, setQuery] = useState<
		Omit<IRequestAnalytics, "step" | "event" | "filterdate">
	>({
		filterdate_from: dNow.month(dNow.month() - 6).format("YYYY-MM-DD"),
		filterdate_to: dNow.format("YYYY-MM-DD"),
	});
	const [errors, setErrors] = useState<{
		filterdate_from?: string;
		filterdate_to?: string;
	}>({});
	const handleChange = (name: string, value: any) => {
		setErrors({});
		setQuery((v) => ({
			...v,
			[name]: value,
		}));
		validate();
	};

	function validate() {
		try {
			if (!query.filterdate_from && !query.filterdate_to) {
				if (!query.filterdate_from) {
					errors.filterdate_from = "Поле обязательно для заполнения";
				}
				if (!query.filterdate_to) {
					errors.filterdate_to = "Поле обязательно для заполнения";
				}
			}
			setErrors(errors);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<Paper>
			<Template.Title>Аналитика</Template.Title>
			<Group justify="flex-end">
				<Text>C</Text>
				<DatePickerInput
					name="filterdate_from"
					value={query.filterdate_from}
					onChange={(value) => handleChange("filterdate_from", value)}
					error={errors?.filterdate_from}
				/>
				<Text>по</Text>
				<DatePickerInput
					name="filterdate_to"
					value={query.filterdate_to}
					onChange={(value) => handleChange("filterdate_to", value)}
					error={errors?.filterdate_to}
				/>
			</Group>
			<DashboardProvider store={useStoreDashboardMain}>
				<UiDashBoard>
					{/* <DashBoardItem
						id="w-1"
						type="test"
						params={{
							timeout: 10,
							title: "Title",
							description: "Описание виджета",
						}}
					/> */}
					<div
						key="event"
						data-grid={{
							x: 0,
							y: 0,
							w: 6,
							h: 6,
						}}
					>
						<AnalyticEventWidget {...query} step="mon" />
					</div>
					<div
						key="pie"
						data-grid={{
							x: 6,
							y: 0,
							w: 6,
							h: 6,
						}}
					>
						<AnalyticPieWidget {...query} step="mon" />
					</div>
					<div
						key="type"
						data-grid={{
							x: 0,
							y: 6,
							w: 6,
							h: 6,
						}}
					>
						<AnalyticTypeWidget {...query} step="mon" />
					</div>
					<div
						key="analytic"
						data-grid={{
							x: 6,
							y: 6,
							w: 6,
							h: 6,
						}}
					>
						<AnalyticAnalyticWidget {...query} step="mon" />
					</div>
					<div
						key="count"
						data-grid={{
							x: 0,
							y: 12,
							w: 6,
							h: 6,
						}}
					>
						<CountWidget {...query} step="d" />
					</div>
				</UiDashBoard>
			</DashboardProvider>
			<Template.Footer>
				<Group>
					<AddWidget store={useStoreDashboardMain} />
					<BtnClear store={useStoreDashboardMain} />
				</Group>
			</Template.Footer>
		</Paper>
	);
};

import { DashboardProvider, UiDashBoard } from "@/entites/dashboard";
import { useStoreDashboardMain } from "@/entites/dashboard/stores/use-store-dashboard-main";
import { AddWidget } from "@/features/dashboard/add-widget";
import { BtnClear } from "@/features/dashboard/btn-clear";
import { BtnEditMode } from "@/features/dashboard/btn-edit-mod";
import { Template } from "@/layout";
import {
	AnalyticAnalyticWidget,
	AnalyticEventWidget,
	AnalyticIncidentWidget,
	AnalyticPieWidget,
	AnalyticTypeWidget,
} from "@/widgets/analytics";
import { CountWidget } from "@/widgets/count-widget";
import { LabelsCountWidget } from "@/widgets/labels/labels-count-widget";
import { Group, Paper } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import { useState } from "react";

const dNow = dayjs();

export const DashboardPage = () => {
	const [query, setQuery] = useState<Omit<IRequestAnalytics, "step" | "event">>(
		{
			filterdate: [
				dayjs()
					.month(dayjs().month() - 1)
					.format("YYYY-MM-DD"),
				dayjs().format("YYYY-MM-DD"),
				// dNow.month(dNow.month() - 6).format("YYYY-MM-DD"),
				// dNow.format("YYYY-MM-DD"),
			],
		},
	);

	return (
		<Paper>
			<Template.Title>Аналитика</Template.Title>
			<Group justify="flex-end">
				<DatePickerInput
					type="range"
					defaultValue={query.filterdate}
					onChange={(filterdate) => {
						if (filterdate[0] && filterdate[1]) {
							setQuery((v) => ({
								...v,
								filterdate,
							}));
						}
					}}
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
					<div
						key="labels-count"
						data-grid={{
							x: 6,
							y: 12,
							w: 6,
							h: 6,
						}}
					>
						<LabelsCountWidget {...query} step="d" />
					</div>
					<div
						key="incident"
						data-grid={{
							x: 12,
							y: 12,
							w: 6,
							h: 6,
						}}
					>
						<AnalyticIncidentWidget {...query} />
					</div>
				</UiDashBoard>
			</DashboardProvider>
			{import.meta.env.DEV && (
				<Template.Footer>
					<Group>
						<AddWidget store={useStoreDashboardMain} />
						<BtnClear store={useStoreDashboardMain} />
						<BtnEditMode store={useStoreDashboardMain} />
					</Group>
				</Template.Footer>
			)}
		</Paper>
	);
};

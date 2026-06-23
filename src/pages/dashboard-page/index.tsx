import { Filterdate } from "@/entites/analytics";
import {
	DashboardProvider,
	DashBoardWidget,
	UiDashBoard,
	useStoreDashboardSecond,
} from "@/entites/dashboard";
import { BtnClear } from "@/features/dashboard/btn-clear";
import { BtnEditMode } from "@/features/dashboard/btn-edit-mod";
import { ModalForm } from "@/features/dashboard/modal";
import { Template } from "@/layout";
import { $setting } from "@/shared";
import { ChartSkeleton } from "@/shared/ui/skeleton";
import {
	isAnalyticsWidgetsLoaded,
	loadAnalyticsWidgets,
} from "@/widgets/analytics/load";
import { Group, Paper } from "@mantine/core";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";

export const DashboardPage = () => {
	const storeDashboard = useStoreDashboardSecond();
	const [widgetsReady, setWidgetsReady] = useState(isAnalyticsWidgetsLoaded);
	const [query, setQuery] = $setting.useState<
		Omit<IRequestAnalytics, "step" | "event">
	>("dashboard-main", {
		filterdate: [
			dayjs()
				.month(dayjs().month() - 3)
				.format("YYYY-MM-DD"),
			dayjs().format("YYYY-MM-DD"),
		],
	});

	useEffect(() => {
		loadAnalyticsWidgets().then(() => setWidgetsReady(true));
	}, []);

	if (!widgetsReady) {
		return (
			<Paper p="md">
				<ChartSkeleton height={240} mih="50vh" />
			</Paper>
		);
	}
	
	return (
		<Paper>
			<Template.Title>Аналитика</Template.Title>
			<Group justify="flex-end">
				<Template.Header>
					<Filterdate
						editable
						value={query.filterdate}
						onChange={useCallback((filterdate) => {
							setQuery((v) => ({
								...v,
								filterdate,
							}));
							storeDashboard.setValue('filterdate', filterdate);
						}, [])}
					/>
				</Template.Header>
			</Group>
			<DashboardProvider store={useStoreDashboardSecond}>
				<UiDashBoard>
					<div
						key="analytic-events"
						data-grid={{
							x: 0,
							y: 0,
							w: 6,
							h: 6,
						}}
					>
						<DashBoardWidget
							widget="analytic-events"
							type="bar"
							events={['v', 'd', 'i']}
							filterdate={query.filterdate}
							allowChangeType={true}
						/>
					</div>
					<div
						key="analytic-labels"
						data-grid={{
							x: 6,
							y: 0,
							w: 6,
							h: 6,
						}}
					>
						<DashBoardWidget
							widget="analytic-labels"
							type="default"
							filterdate={query.filterdate}
							allowChangeType={true}
						/>
					</div>
					<div
						key="analytic-event-defect"
						data-grid={{
							x: 0,
							y: 6,
							w: 6,
							h: 6,
						}}
					>
						<DashBoardWidget
							widget="analytic-event-defect"
							type="analytic"
							filterdate={query.filterdate}
						/>
					</div>
					<div
						key="analytic-pie"
						data-grid={{
							x: 6,
							y: 6,
							w: 6,
							h: 6,
						}}
					>
						<DashBoardWidget
							widget="analytic-pie"
							events={['v', 'd', 'p']}
							filterdate={query.filterdate}
							percent={true}
							step="mon"
						/>
					</div>
					<div
						key="analytic-type"
						data-grid={{
							x: 0,
							y: 12,
							w: 6,
							h: 6,
						}}
					>
						<DashBoardWidget
							widget="analytic-type"
							filterdate={query.filterdate}
							step="mon"
						/>
					</div>
					<div
						key="analytics-incident"
						data-grid={{
							x: 6,
							y: 12,
							w: 6,
							h: 6,
						}}
					>
						<DashBoardWidget
							widget="analytic-incident"
							filterdate={query.filterdate}
						/>
					</div>

					{/* <div
						key="analytics-count"
						data-grid={{
							x: 6,
							y: 24,
							w: 6,
							h: 6,
						}}
					>
						<DashBoardWidget
							widget="analytics-count"
							filterdate="$filterdate"
						/>
					</div>
					<div
						key="count"
						data-grid={{
							x: 0,
							y: 30,
							w: 6,
							h: 6,
						}}
					>
						<DashBoardWidget widget="count" filterdate="$filterdate" />
					</div> */}
				</UiDashBoard>
				<ModalForm dashboard={storeDashboard} />
				<Template.Footer>
					<Group>
						<BtnClear dashboard={storeDashboard} />
						<BtnEditMode dashboard={storeDashboard} />
					</Group>
				</Template.Footer>
			</DashboardProvider>
		</Paper>
	);
};

import {
	DashBoardWidget,
	UiDashBoard,
	useStoreDashboardSecond,
	WidgetsProvider,
} from "@/entites/widget";
import { BtnClear } from "@/features/widget/btn-clear";
import { BtnEditMode } from "@/features/widget/btn-edit-mod";
import { WidgetForm } from "@/features/widget/form/widget-form";
import { Template } from "@/layout";
import { $setting } from "@/shared";
import { DualCalendarRange } from "@/shared/ui";
import { WidgetAnalyticIncident } from "@/widgets/analytics/incident";
import { Group, Modal, Paper } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export const DashboardPage = () => {
	const storeDashboard = useStoreDashboardSecond();
	const [opened, { open, close }] = useDisclosure(false);
	const [layout, setLayout] = useState<Partial<ILayoutItem>>({});
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
		storeDashboard.id && open();
	}, [storeDashboard.id]);
	return (
		<Paper>
			<Template.Title>Аналитика</Template.Title>
			<Group justify="flex-end">
				<DualCalendarRange
					value={query.filterdate}
					onChange={(filterdate) => {
						if (filterdate[0] && filterdate[1]) {
							setQuery((v) => ({
								...v,
								filterdate,
							}));
							storeDashboard.setValue("filterdate", filterdate);
						}
					}}
				/>
			</Group>
			<WidgetsProvider store={useStoreDashboardSecond}>
				<UiDashBoard
					onSelection={(react: Partial<ILayoutItem>) => {
						setLayout(react);
						useStoreDashboardSecond.setState({
							preview: react,
						});
						open();
					}}
				>
					<div
						key="event"
						data-grid={{
							x: 0,
							y: 0,
							w: 6,
							h: 6,
						}}
					>
						<DashBoardWidget widget="labels-count" />
					</div>
					{/* <div
						key="pie"
						data-grid={{
							x: 6,
							y: 0,
							w: 6,
							h: 6,
						}}
					>
						<DashBoardWidget
							widget="labels-pie"
							filterdate="$filterdate"
							step="mon"
						/>
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
						<DashBoardWidget
							widget="labels-type"
							filterdate="$filterdate"
							step="mon"
						/>
					</div> */}
					<div
						key="analytic"
						data-grid={{
							x: 6,
							y: 6,
							w: 6,
							h: 6,
						}}
					>
						<DashBoardWidget widget="AnalyticAnalyticWidget" />
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
						<DashBoardWidget widget="CountWidget" filterdate="$filterdate" />
					</div>
					{/* <div
						key="labels-count"
						data-grid={{
							x: 6,
							y: 12,
							w: 6,
							h: 6,
						}}
					>
						<DashBoardWidget widget="labels-event" filterdate="$filterdate" />
					</div> */}
					<div
						key="incident"
						data-grid={{
							x: 12,
							y: 12,
							w: 6,
							h: 6,
						}}
					>
						<WidgetAnalyticIncident
							filterdate={storeDashboard.getValue("$filterdate")}
						/>
						{/* <DashBoardWidget
							widget="AnalyticIncidentWidget"
							filterdate="$filterdate"
						/> */}
					</div>
				</UiDashBoard>
			</WidgetsProvider>
			<Modal
				title="Настройка виджета"
				opened={opened}
				keepMounted={false}
				onClose={() => {
					storeDashboard.clear();
					close();
				}}
			>
				{opened && (
					<WidgetForm
						id={storeDashboard.id}
						store={useStoreDashboardSecond}
						onSave={() => {
							storeDashboard.clear();
							close();
						}}
						layout={layout}
					/>
				)}
			</Modal>
			<Template.Footer>
				<Group>
					<BtnClear store={useStoreDashboardSecond} />
					<BtnEditMode store={useStoreDashboardSecond} />
				</Group>
			</Template.Footer>
		</Paper>
	);
};

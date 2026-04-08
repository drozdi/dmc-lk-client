import {
	DashBoardWidget,
	UiDashBoard,
	useStoreDashboardMain,
	WidgetsProvider,
} from "@/entites/widget";
import { BtnClear } from "@/features/widget/btn-clear";
import { BtnEditMode } from "@/features/widget/btn-edit-mod";
import { WidgetForm } from "@/features/widget/form/widget-form";
import { Template } from "@/layout";
import { $setting } from "@/shared";
import { DualCalendarRange } from "@/shared/ui";
import { Group, Modal, Paper } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export const DashboardPage = () => {
	const storeDashboardMain = useStoreDashboardMain();
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
		storeDashboardMain.id && open();
	}, [storeDashboardMain.id]);
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
							storeDashboardMain.setValue("filterdate", filterdate);
						}
					}}
				/>
			</Group>
			<WidgetsProvider store={useStoreDashboardMain}>
				<UiDashBoard
					onSelection={(react: Partial<ILayoutItem>) => {
						setLayout(react);
						useStoreDashboardMain.setState({
							preview: react,
						});
						open();
					}}
				>
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
						<DashBoardWidget
							type="AnalyticEventWidget"
							filterdate="$filterdate"
							step="mon"
						/>
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
						<DashBoardWidget
							type="AnalyticPieWidget"
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
							type="AnalyticTypeWidget"
							filterdate="$filterdate"
							step="mon"
						/>
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
						<DashBoardWidget type="AnalyticAnalyticWidget" />
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
						<DashBoardWidget type="CountWidget" filterdate="$filterdate" />
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
						<DashBoardWidget type="LabelsCountWidget" />
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
						<DashBoardWidget
							type="AnalyticIncidentWidget"
							filterdate="$filterdate"
						/>
					</div>
				</UiDashBoard>
			</WidgetsProvider>
			<Modal
				title="Настройка виджета"
				opened={opened}
				keepMounted={false}
				onClose={() => {
					storeDashboardMain.clear();
					close();
				}}
			>
				{opened && (
					<WidgetForm
						id={storeDashboardMain.id}
						store={useStoreDashboardMain}
						onSave={() => {
							storeDashboardMain.clear();
							close();
						}}
						layout={layout}
					/>
				)}
			</Modal>
			<Template.Footer>
				<Group>
					<BtnClear store={useStoreDashboardMain} />
					<BtnEditMode store={useStoreDashboardMain} />
				</Group>
			</Template.Footer>
		</Paper>
	);
};

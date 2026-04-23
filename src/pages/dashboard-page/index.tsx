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
						key="analytic-events-table"
						data-grid={{
							x: 0,
							y: 0,
							w: 6,
							h: 6,
						}}
					>
						<DashBoardWidget
							widget="analytic-events"
							type="table"
							filterdate="$filterdate"
						/>
					</div>
					<div
						key="analytic-events-bar"
						data-grid={{
							x: 6,
							y: 0,
							w: 6,
							h: 6,
						}}
					>
						<DashBoardWidget
							widget="analytic-events"
							type="bar"
							events={["v", "d", "p"]}
							filterdate="$filterdate"
						/>
					</div>
					<div
						key="analytic-events"
						data-grid={{
							x: 0,
							y: 6,
							w: 6,
							h: 6,
						}}
					>
						<DashBoardWidget
							widget="analytic-events"
							filterdate="$filterdate"
						/>
					</div>

					<div
						key="analytic-events-analitic"
						data-grid={{
							x: 6,
							y: 6,
							w: 6,
							h: 6,
						}}
					>
						<DashBoardWidget
							widget="analytic-events"
							type="analytic"
							events={["v", "d", "i"]}
							filterdate="$filterdate"
						/>
					</div>
					<div
						key="analytic-pie"
						data-grid={{
							x: 0,
							y: 12,
							w: 6,
							h: 6,
						}}
					>
						<DashBoardWidget
							widget="analytic-pie"
							events={["v", "d", "p"]}
							filterdate="$filterdate"
							step="mon"
						/>
					</div>
					<div
						key="analytic-type"
						data-grid={{
							x: 6,
							y: 12,
							w: 6,
							h: 6,
						}}
					>
						<DashBoardWidget
							widget="analytic-type"
							filterdate="$filterdate"
							step="mon"
						/>
					</div>
					<div
						key="analytics-incident"
						data-grid={{
							x: 0,
							y: 18,
							w: 6,
							h: 6,
						}}
					>
						<DashBoardWidget
							widget="analytics-incident"
							filterdate="$filterdate"
						/>
					</div>
					<div
						key="analytics-count"
						data-grid={{
							x: 6,
							y: 18,
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
							y: 24,
							w: 6,
							h: 6,
						}}
					>
						<DashBoardWidget widget="count" filterdate="$filterdate" />
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

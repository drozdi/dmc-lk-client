import { UiDashBoard, WidgetsProvider } from "@/entites/widget";
import { useStoreDashboardMain } from "@/entites/widget/stores/use-store-dashboard-main";
import { BtnClear } from "@/features/widget/btn-clear";
import { BtnEditMode } from "@/features/widget/btn-edit-mod";
import { WidgetForm } from "@/features/widget/form/widget-form";
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
import { Group, Modal, Paper } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import { useState } from "react";

export const DashboardPage = () => {
	const storeDashboardMain = useStoreDashboardMain();
	const [opened, { open, close }] = useDisclosure(false);
	const [layout, setLayout] = useState<Partial<ILayoutItem>>({});
	const [query, setQuery] = useState<Omit<IRequestAnalytics, "step" | "event">>(
		{
			filterdate: [
				dayjs()
					.month(dayjs().month() - 3)
					.format("YYYY-MM-DD"),
				dayjs().format("YYYY-MM-DD"),
			],
		},
	);
	console.log(storeDashboardMain);
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
			</WidgetsProvider>
			<Modal title="Добавить виджет" opened={opened} onClose={close}>
				<WidgetForm
					store={useStoreDashboardMain}
					onSave={() => {
						useStoreDashboardMain.getState().clear();
						close();
					}}
					layout={layout}
				/>
			</Modal>
			{import.meta.env.DEV && (
				<Template.Footer>
					<Group>
						<BtnClear store={useStoreDashboardMain} />
						<BtnEditMode store={useStoreDashboardMain} />
					</Group>
				</Template.Footer>
			)}
		</Paper>
	);
};

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
import { DualCalendarRange } from "@/shared/ui";
import { Group, Modal, Paper } from "@mantine/core";
import { type DateValue } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";

export const MainPage = () => {
	const storeDashboardMain = useStoreDashboardMain();
	const [opened, { open, close }] = useDisclosure(false);
	const [layout, setLayout] = useState<Partial<ILayoutItem> | undefined>({});
	useEffect(() => {
		storeDashboardMain.id && open();
	}, [storeDashboardMain.id]);

	return (
		<Paper>
			<Template.Title>Аналитика</Template.Title>
			<Group justify="flex-end">
				<DualCalendarRange
					value={
						storeDashboardMain.getValue("$filterdate") as [DateValue, DateValue]
					}
					onChange={(filterdate) => {
						if (filterdate[0] && filterdate[1]) {
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
					<div
						key="itog.sum"
						data-grid={{
							x: 0,
							y: 0,
							w: 3,
							h: 2,
						}}
					>
						<DashBoardWidget
							widget="main-itog-set"
							filterdate="$filterdate"
							type="sum"
						/>
					</div>
					<div
						key="itog.avg"
						data-grid={{
							x: 3,
							y: 0,
							w: 3,
							h: 2,
						}}
					>
						<DashBoardWidget
							widget="main-itog-set"
							filterdate="$filterdate"
							type="avg"
						/>
					</div>
					<div
						key="itog.min"
						data-grid={{
							x: 6,
							y: 0,
							w: 3,
							h: 2,
						}}
					>
						<DashBoardWidget
							widget="main-itog-set"
							filterdate="$filterdate"
							type="min"
						/>
					</div>
					<div
						key="itog.max"
						data-grid={{
							x: 9,
							y: 0,
							w: 3,
							h: 2,
						}}
					>
						<DashBoardWidget
							widget="main-itog-set"
							filterdate="$filterdate"
							type="max"
						/>
					</div>
					<div
						key="itog.analytics"
						data-grid={{
							x: 0,
							y: Infinity,
							w: 10,
							h: 10,
						}}
					>
						<DashBoardWidget
							widget="main-itog-analytics"
							filterdate="$filterdate"
						/>
					</div>
					<div
						key="type"
						data-grid={{
							x: 0,
							y: Infinity,
							w: 10,
							h: 10,
						}}
					>
						<DashBoardWidget
							widget="main-type"
							type="stack"
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

import {
	DashBoardWidget,
	UiDashBoard,
	useStoreDashboardMain,
	WidgetsProvider,
} from "@/entites/widget";
import { useAnalytics } from "@/features/main";
import { BtnClear } from "@/features/widget/btn-clear";
import { BtnEditMode } from "@/features/widget/btn-edit-mod";
import { WidgetForm } from "@/features/widget/form/widget-form";
import { Template } from "@/layout";
import { $setting } from "@/shared";
import { DualCalendarRange, Widget } from "@/shared/ui";
import { Group, Modal, Paper } from "@mantine/core";
import { type DateValue } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { TbReload } from "react-icons/tb";

const stepLabel = {
	s: "секундам",
	m: "минутам",
	h: "часам",
	d: "дням",
	w: "неделям",
	mon: "месяцам",
	y: "годам",
};

export const MainPage = () => {
	const storeDashboardMain = useStoreDashboardMain();
	const [opened, { open, close }] = useDisclosure(false);
	const [layout, setLayout] = useState<Partial<ILayoutItem> | undefined>({});
	useEffect(() => {
		storeDashboardMain.id && open();
	}, [storeDashboardMain.id]);

	const [filterdate, setFilterdate] = useState<[DateValue, DateValue]>(
		storeDashboardMain.getValue("$filterdate"),
	);

	const { query, fetch, reset } = useAnalytics({
		filterdate,
		event: "p",
	});
	useEffect(() => {
		fetch({ filterdate, event: "p" });
	}, [filterdate]);

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
							setFilterdate(filterdate);
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
							x: 10,
							y: 0,
							w: 2,
							h: 2,
						}}
					>
						<DashBoardWidget
							widget="main-itog-set"
							filterdate={filterdate}
							type="sum"
						/>
					</div>
					<div
						key="itog.avg"
						data-grid={{
							x: 10,
							y: 2,
							w: 2,
							h: 2,
						}}
					>
						<DashBoardWidget
							widget="main-itog-set"
							filterdate={filterdate}
							type="avg"
						/>
					</div>
					<div
						key="itog.min"
						data-grid={{
							x: 10,
							y: 4,
							w: 2,
							h: 2,
						}}
					>
						<DashBoardWidget
							widget="main-itog-set"
							filterdate={filterdate}
							type="min"
						/>
					</div>
					<div
						key="itog.max"
						data-grid={{
							x: 10,
							y: 6,
							w: 2,
							h: 2,
						}}
					>
						<DashBoardWidget
							widget="main-itog-set"
							filterdate={filterdate}
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
						<Widget
							title={`Работа за ${dayjs(query.filterdate[0]).format($setting.get("formatDate"))}-${dayjs(query.filterdate[1]).format($setting.get("formatDate"))} по ${stepLabel[query.step]}`}
							menu={[
								{
									children: "Сбросить",
									onClick: () => {
										setFilterdate(storeDashboardMain.getValue("$filterdate"));
									},
									leftSection: <TbReload />,
								},
							]}
						>
							<DashBoardWidget
								widget="main-itog-analytics"
								filterdate={filterdate}
								onChange={(query: IRequestAnalytics) => {
									setFilterdate(query.filterdate);
								}}
							/>
							<DashBoardWidget
								widget="main-labels"
								type="table"
								filterdate={filterdate}
							/>
						</Widget>
					</div>
					<div
						key="labels.bar"
						data-grid={{
							x: 0,
							y: Infinity,
							w: 10,
							h: 10,
						}}
					>
						<DashBoardWidget
							widget="main-labels"
							type="default"
							filterdate={filterdate}
						/>
					</div>
					<div
						key="labels.stack"
						data-grid={{
							x: 0,
							y: Infinity,
							w: 10,
							h: 10,
						}}
					>
						<DashBoardWidget
							widget="main-labels"
							type="stack"
							filterdate={filterdate}
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

import { corectQuery, Filterdate, QueryShow } from "@/entites/analytics";
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
import { Widget } from "@/shared/ui";
import { Group, Modal, Paper } from "@mantine/core";
import { type DateValue } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { TbArrowBackUp, TbReload } from "react-icons/tb";
import { type MouseHandlerDataParam } from "recharts";


export const MainPage = () => {
	const storeDashboardMain = useStoreDashboardMain();
	const [opened, { open, close }] = useDisclosure(false);
	const [layout, setLayout] = useState<Partial<ILayoutItem> | undefined>({});
	const [history, setHistory] = useState([]);

	useEffect(() => {
		storeDashboardMain.id && open();
	}, [storeDashboardMain.id]);

	const [filterdate, setFilterdate] = useState<[DateValue, DateValue]>(
		storeDashboardMain.getValue("$filterdate"),
	);

	const [query, setQuery] = useState<IRequestAnalytics>(
		corectQuery({
			filterdate,
		} as IRequestAnalytics),
	);
	useEffect(() => {
		setQuery(corectQuery({ filterdate } as IRequestAnalytics));
	}, [filterdate]);

	const handleClick = (arg: MouseHandlerDataParam) => {
		const { activeLabel } = arg;
		if (!activeLabel) {
			return;
		}

		const step =
			query.step === "y"
				? "mon"
				: query.step === "mon"
					? "w"
					: query.step === "w"
						? "d"
						: query.step === "d"
							? "h"
							: query.step === "h"
								? "m"
								: "s";

		const filterdate: [DateValue, DateValue] = ["", ""];

		if (step === "s") {
			const d = dayjs(query.filterdate[0]).minute(Number(activeLabel));
			filterdate[0] = d.startOf("s").format("YYYY-MM-DD HH:mm:00");
			filterdate[1] = d.endOf("s").format("YYYY-MM-DD HH:mm:59");
		} else if (step === "m") {
			const d = dayjs(query.filterdate[0]).hour(Number(activeLabel));
			filterdate[0] = d.startOf("h").format("YYYY-MM-DD HH:mm:ss");
			filterdate[1] = d.endOf("h").format("YYYY-MM-DD HH:mm:ss");
		} else if (step === "h") {
			filterdate[0] = dayjs(activeLabel)
				.startOf("d")
				.format("YYYY-MM-DD HH:mm:ss");
			filterdate[1] = dayjs(activeLabel)
				.endOf("d")
				.format("YYYY-MM-DD HH:mm:ss");
		} else if (step === "d") {
			filterdate[0] = dayjs(activeLabel).startOf("w").format("YYYY-MM-DD");
			filterdate[1] = dayjs(activeLabel).endOf("w").format("YYYY-MM-DD");
		} else if (step === "w") {
			filterdate[0] = dayjs(activeLabel).startOf("M").format("YYYY-MM-DD");
			filterdate[1] = dayjs(activeLabel).endOf("M").format("YYYY-MM-DD");
		} else if (step === "mon") {
			filterdate[0] = dayjs(activeLabel).startOf("y").format("YYYY-MM-DD");
			filterdate[1] = dayjs(activeLabel).endOf("y").format("YYYY-MM-DD");
		}
		const newQuery = corectQuery({ ...query, filterdate, step });
		setHistory((v) => [...v, query]);
		setQuery(newQuery);
	};
	const back = () => {
		if (!history?.length) {
			return;
		}
		const newQuery = history.pop();
		setHistory([...history]);
		setQuery(newQuery);
	};

	const handleFilterdate = useCallback((filterdate: [DateValue, DateValue]) => {
		storeDashboardMain.setValue("filterdate", filterdate);
		setFilterdate(filterdate);
		setHistory([]);
	}, []);

	useEffect(
		() => {
			setFilterdate(storeDashboardMain.getValue("$filterdate"));
		},
		storeDashboardMain.getValue("$filterdate") || [],
	);

	return (
		<Paper>
			<Template.Title>Аналитика</Template.Title>
			<Group justify="flex-end">
				<Template.Header>
					<Filterdate
						editable
						value={
							storeDashboardMain.getValue("$filterdate") as [DateValue, DateValue]
						}
						onChange={handleFilterdate}
					/>
				</Template.Header>
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
						key="labels.current.balance"
						data-grid={{
							x: 10,
							y: 0,
							w: 2,
							h: 2,
						}}
					>
						<DashBoardWidget widget="labels-current-balance" />
					</div>
					<div
						key="labels.current.balance.reb"
						data-grid={{
							x: 10,
							y: 2,
							w: 2,
							h: 2,
						}}
					>
						<DashBoardWidget widget="labels-current-balance" type="reb" />
					</div>
					<div
						key="itog.sum"
						data-grid={{
							x: 10,
							y: 4,
							w: 2,
							h: 2,
						}}
					>
						<DashBoardWidget
							widget="analytic-itog-set"
							filterdate={query.filterdate}
							type="sum"
						/>
					</div>
					<div
						key="itog.avg"
						data-grid={{
							x: 10,
							y: 6,
							w: 2,
							h: 2,
						}}
					>
						<DashBoardWidget
							widget="analytic-itog-set"
							filterdate={query.filterdate}
							type="avg"
						/>
					</div>
					<div
						key="itog.min"
						data-grid={{
							x: 10,
							y: 8,
							w: 2,
							h: 2,
						}}
					>
						<DashBoardWidget
							widget="analytic-itog-set"
							filterdate={query.filterdate}
							type="min"
						/>
					</div>
					<div
						key="itog.max"
						data-grid={{
							x: 10,
							y: 10,
							w: 2,
							h: 2,
						}}
					>
						<DashBoardWidget
							widget="analytic-itog-set"
							filterdate={query.filterdate}
							type="max"
						/>
					</div>
					<div
						key="itog.d.max"
						data-grid={{
							x: 10,
							y: 12,
							w: 2,
							h: 2,
						}}
					>
						<DashBoardWidget
							widget="analytic-itog-set"
							filterdate={query.filterdate}
							event="d"
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
							title={`Работа за ${QueryShow({...query, type: 'by'})}`}
							menu={[
								{
									children: "Сбросить",
									onClick: () => {
										setFilterdate([
											...storeDashboardMain.getValue("$filterdate"),
										]);
										setHistory([]);
									},
									leftSection: <TbReload />,
								},
								{
									children: "Назад",
									onClick: back,
									disabled: !history?.length,
									leftSection: <TbArrowBackUp />,
								},
							]}
						>
							<DashBoardWidget
								widget="analytic-events"
								type="stack"
								events={["v", "d"]}
								filterdate={query.filterdate}
								step={query.step}
								stop="m"
								onClick={handleClick}
							/>
							<DashBoardWidget
								widget="analytic-events"
								type="table"
								events={["v", "d"]}
								{...query}
								onClick={handleClick}
							/>
							{/* <DashBoardWidget
								widget="analytic-labels"
								type="table"
								filterdate={filterdate}
							/> */}
						</Widget>
					</div>
					<div
						key="analytic.labels"
						data-grid={{
							x: 6,
							y: Infinity,
							w: 6,
							h: 6,
						}}
					>
						<DashBoardWidget
							widget="analytic-labels"
							type="default"
							filterdate={query.filterdate}
						/>
					</div>
					<div
						key="analytic.labels.stack"
						data-grid={{
							x: 0,
							y: Infinity,
							w: 6,
							h: 6,
						}}
					>
						<DashBoardWidget
							widget="analytic-labels"
							type="stack"
							filterdate={query.filterdate}
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

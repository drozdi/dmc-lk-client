import {
	corectQuery,
	Filterdate,
	formatDrillDownBreadcrumb,
	QueryShow,
} from "@/entites/analytics";
import {
	DashboardProvider,
	DashBoardWidget,
	UiDashBoard,
	useStoreDashboardMain,
} from "@/entites/dashboard";
import { AnalyticItogSummary } from "@/features/analytics/widgets/itog-summary";
import { BtnClear } from "@/features/dashboard/btn-clear";
import { BtnEditMode } from "@/features/dashboard/btn-edit-mod";
import { ModalForm } from "@/features/dashboard/modal";
import { Template } from "@/layout";
import { Widget } from "@/shared/ui";
import { Breadcrumbs, Group, Paper, Text } from "@mantine/core";
import { type DateValue } from "@mantine/dates";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TbArrowBackUp, TbReload } from "react-icons/tb";
import { type MouseHandlerDataParam } from "recharts";

export const MainPage = () => {
	const storeDashboardMain = useStoreDashboardMain();
	const storeFilterdate = useStoreDashboardMain(
		(state) =>
			(state.values["$filterdate"] ??
				state.varibles["$filterdate"]?.default) as [DateValue, DateValue],
	);

	const [history, setHistory] = useState<IRequestAnalytics[]>([]);

	const [filterdate, setFilterdate] = useState<[DateValue, DateValue]>(
		storeFilterdate,
	);

	const [query, setQuery] = useState<IRequestAnalytics>(
		corectQuery({
			filterdate,
		} as IRequestAnalytics),
	);

	useEffect(() => {
		setQuery(corectQuery({ filterdate } as IRequestAnalytics));
	}, [filterdate]);

	const breadcrumb = useMemo(
		() => formatDrillDownBreadcrumb(history, query),
		[history, query],
	);

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
		setHistory((prev) => {
			if (!prev.length) {
				return prev;
			}
			const previousQuery = prev[prev.length - 1]!;
			setQuery(previousQuery);
			return prev.slice(0, -1);
		});
	};

	const handleFilterdate = useCallback(
		(filterdate: [DateValue, DateValue]) => {
			storeDashboardMain.setValue("filterdate", filterdate);
			setFilterdate(filterdate);
			setHistory([]);
		},
		[storeDashboardMain],
	);

	useEffect(() => {
		setFilterdate(storeFilterdate);
	}, [storeFilterdate]);

	return (
		<Paper>
			<Template.Title>Аналитика</Template.Title>
			<Group justify="flex-end">
				<Template.Header>
					<Filterdate
						editable
						value={storeFilterdate}
						onChange={handleFilterdate}
					/>
				</Template.Header>
			</Group>
			<DashboardProvider store={useStoreDashboardMain}>
				<UiDashBoard>
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
						key="itog.summary"
						data-grid={{
							x: 10,
							y: 4,
							w: 2,
							h: 8,
						}}
					>
						<Widget
							title="Сводка"
							subTitle={
								<>
									За{" "}
									<QueryShow
										filterdate={query.filterdate}
										step={query.step}
										event="p"
									/>
								</>
							}
							expanded={false}
						>
							<AnalyticItogSummary filterdate={query.filterdate} />
						</Widget>
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
							title={`Работа за ${QueryShow({ ...query, type: "by" })}`}
							subTitle={
								breadcrumb ? (
									<Breadcrumbs separator="→">
										{breadcrumb.split(" → ").map((item) => (
											<Text key={item} size="sm">
												{item}
											</Text>
										))}
									</Breadcrumbs>
								) : undefined
							}
							menu={[
								{
									children: "Сбросить",
									onClick: () => {
										setFilterdate([...storeFilterdate]);
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
						</Widget>
					</div>
					<div
						key="analytic.labels"
						data-grid={{
							x: 0,
							y: Infinity,
							w: 12,
							h: 6,
						}}
					>
						<DashBoardWidget
							widget="analytic-labels"
							type="default"
							allowChangeType
							filterdate={query.filterdate}
						/>
					</div>
				</UiDashBoard>
				<ModalForm dashboard={storeDashboardMain} />
				<Template.Footer>
					<Group>
						<BtnClear dashboard={storeDashboardMain} />
						<BtnEditMode dashboard={storeDashboardMain} />
					</Group>
				</Template.Footer>
			</DashboardProvider>
		</Paper>
	);
};

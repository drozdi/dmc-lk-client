import {
	DashBoardItem,
	DashboardProvider,
	UiDashBoard,
} from "@/entites/dashboard";
import {
	AnalyticEventWidget,
	AnalyticPieWidget,
	AnalyticTypeWidget,
} from "@/widgets/analytics";
import { TesstWidget } from "@/widgets/test";
import { Group, Paper, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Template } from "@t";
import dayjs from "dayjs";
import { useState } from "react";

const dNow = dayjs("2025-05-02");
const ww = [
	{
		key: "event",
		element: AnalyticEventWidget,
	},
	{
		key: "pie",
		element: AnalyticPieWidget,
	},
	{
		key: "type",
		element: AnalyticTypeWidget,
	},
];

export const DashboardPage = () => {
	const [query, setQuery] = useState<
		Omit<IRequestAnalytics, "step" | "event" | "filterdate">
	>({
		filterdate_from: dNow.month(dNow.month() - 6).format("YYYY-MM-DD"),
		filterdate_to: dNow.format("YYYY-MM-DD"),
	});
	const [errors, setErrors] = useState<{
		filterdate_from?: string;
		filterdate_to?: string;
	}>({});
	const handleChange = (name: string, value: any) => {
		setErrors({});
		setQuery((v) => ({
			...v,
			[name]: value,
		}));
		validate();
	};

	function validate() {
		try {
			if (!query.filterdate_from && !query.filterdate_to) {
				if (!query.filterdate_from) {
					errors.filterdate_from = "Поле обязательно для заполнения";
				}
				if (!query.filterdate_to) {
					errors.filterdate_to = "Поле обязательно для заполнения";
				}
			}
			setErrors(errors);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<Paper>
			<Template.Title>Аналитика</Template.Title>
			<Group justify="flex-end">
				<Text>C</Text>
				<DatePickerInput
					name="filterdate_from"
					value={query.filterdate_from}
					onChange={(value) => handleChange("filterdate_from", value)}
					error={errors?.filterdate_from}
				/>
				<Text>по</Text>
				<DatePickerInput
					name="filterdate_to"
					value={query.filterdate_to}
					onChange={(value) => handleChange("filterdate_to", value)}
					error={errors?.filterdate_to}
				/>
			</Group>
			<DashboardProvider
				storageKey="main"
				initialWidgets={[
					{ type: "TesstWidget" },
					{ type: "TesstWidget" },
					{ type: "TesstWidget" },
					{ type: "TesstWidget" },
				]}
			>
				<UiDashBoard>
					<DashBoardItem
						key="w-1"
						type="TesstWidget"
						data-grid={{ x: 0, y: Infinity, w: 6, h: 6 }}
					>
						<TesstWidget timeout={10} />
					</DashBoardItem>
					<DashBoardItem
						key="w-2"
						type="TesstWidget"
						data-grid={{ x: 6, y: Infinity, w: 6, h: 6 }}
					>
						<TesstWidget timeout={9} />
					</DashBoardItem>
					<DashBoardItem
						key="w-3"
						type="TesstWidget"
						data-grid={{ x: 0, y: Infinity, w: 6, h: 6 }}
					>
						<TesstWidget timeout={10} />
					</DashBoardItem>
					<DashBoardItem
						key="w-4"
						type="TesstWidget"
						data-grid={{ x: 6, y: Infinity, w: 6, h: 6 }}
					>
						<TesstWidget timeout={7} />
					</DashBoardItem>
					{/* {ww.map((item) => (
						<DashBoardItem
							key={item.key}
							data-grid={{ x: Infinity, y: Infinity, w: 6, h: 6 }}
						>
							{createElement(item.element, {
								...query,
								step: "mon",
							})}
						</DashBoardItem>
					))} */}
				</UiDashBoard>
			</DashboardProvider>
		</Paper>
	);
};

import { DashBoardItem, DashBoardProvider } from "@/entites/dashboard";
import {
	AnalyticEventWidget,
	AnalyticPieWidget,
	AnalyticTypeWidget,
} from "@/widgets/analytics";
import { Group, Paper, SimpleGrid, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Template } from "@t";
import dayjs from "dayjs";
import { createElement, useState } from "react";

const dNow = dayjs("2025-05-02");

const ww = [
	{
		id: "main-1",
		title: "title-1",
		description: "description-1",
		element: AnalyticEventWidget,
		icon: <></>,
	},
	{
		id: "main-2",
		title: "title-2",
		description: "description-2",
		element: AnalyticPieWidget,
		icon: <></>,
	},
	{
		id: "main-3",
		title: "title-3",
		description: "description-3",
		element: AnalyticTypeWidget,
		icon: <></>,
	},
];

export const DashboardPage = () => {
	const [query, setQuery] = useState<
		Omit<IRequestAnalytics, "step" | "event" | "filterdate">
	>({
		filterdate_from: dNow.month(dNow.month() - 6).format("YYYY-MM-DD"),
		filterdate_to: dNow.format("YYYY-MM-DD"),
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
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
			<Group justify="center">
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
			<DashBoardProvider name="main" items={ww}>
				<SimpleGrid cols={2}>
					{ww.map((item) => (
						<DashBoardItem key={item.id} id={item.id}>
							<div>
								{createElement(item.element, {
									...query,
									step: "mon",
								})}
							</div>
						</DashBoardItem>
					))}
				</SimpleGrid>
			</DashBoardProvider>
		</Paper>
	);
};

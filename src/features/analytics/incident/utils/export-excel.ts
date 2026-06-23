import { downloadExcel } from "@/shared/utils/excel";
import dayjs from "dayjs";

export function exportIncidentSummary(
	data: IAnalyticsIncidentItem[],
	fileName = "incidents-summary",
) {
	downloadExcel(
		data.map((item) => ({
			Ошибка: item.data,
			"Всего ошибок": item.total_counter,
		})),
		fileName,
		["Ошибка", "Всего ошибок"],
	);
}

export function exportIncidentDetailed(
	data: IAnalyticsIncidentItem[],
	fields: string[],
	findLabelByCode: (code: string) => string,
	filterdate: [string | Date | null, string | Date | null],
) {
	const fieldHeaders = fields.map((field) => findLabelByCode(field));
	const header = ["Ошибка", "Всего ошибок", ...fieldHeaders];

	const rows = data.map((item) => {
		const row: Record<string, string | number> = {
			Ошибка: item.data,
			"Всего ошибок": item.total_counter,
		};

		fields.forEach((field, index) => {
			row[fieldHeaders[index]] = item[field] ?? "";
		});

		return row;
	});

	const from = dayjs(filterdate[0]).format("YYYY-MM-DD");
	const to = dayjs(filterdate[1]).format("YYYY-MM-DD");

	downloadExcel(rows, `incidents-${from}_${to}`, header);
}

export function exportIncidentChart(
	data: Array<{ name: string; value: number }>,
	filterdate: [string | Date | null, string | Date | null],
) {
	const from = dayjs(filterdate[0]).format("YYYY-MM-DD");
	const to = dayjs(filterdate[1]).format("YYYY-MM-DD");

	downloadExcel(
		data.map((item) => ({
			Ошибка: item.name,
			"Всего ошибок": item.value,
		})),
		`incidents-${from}_${to}`,
		["Ошибка", "Всего ошибок"],
	);
}

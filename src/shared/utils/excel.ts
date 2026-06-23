import { utils, write } from "xlsx";

const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

export function toExcel(data, header?: string[]) {
	const reportExcel = data;
	const ws = utils.json_to_sheet(reportExcel, {
		header
	});
	if (reportExcel.length > 0) {
		const columnWidths = {};
		Object.keys(reportExcel[0]).forEach((key) => {
			columnWidths[key] = key.length;
		});
		reportExcel.forEach((row) => {
			Object.keys(row).forEach((key) => {
				const value = String(row[key] || "");
				if (value.length > columnWidths[key]) {
					columnWidths[key] = value.length;
				}
			});
		});
		ws["!cols"] = Object.values(columnWidths).map((width) => ({
			wch: width + 4,
		}));
	}

	const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
	const excelBuffer = write(wb, { bookType: "xlsx", type: "array" });

	return new Blob([excelBuffer], { type: fileType });
}
export function downloadExcel(data, fileName: string = 'download', header?: string[]) {
	const blob = toExcel(data, header)
	const URL = window.URL || window.webkitURL
	const a = document.createElement('a')
	a.href = typeof URL.createObjectURL === 'undefined' ? fileType : URL.createObjectURL(blob)
	a.download = `${fileName}${fileExtension}`
	a.click()
}
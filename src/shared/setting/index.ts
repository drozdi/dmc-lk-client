import { Setting } from "./Setting";

export * from "./Config";
export * from "./Setting";

export const $setting = new Setting(
	{
		"api.timeout": 5,
		"production.id": 0,
		"productions.id": [],
		size: "15",
		limits: ["15", "30", "50", "75", "100"],
		formatDate: "DD.MM.YYYY",
		formatTime: "HH:mm",
		formatTimeFull: "HH:mm:ss",
		formatDateTime: "%formatDate% %formatTime%",
		formatDateTimeFull: "%formatDate% %formatTimeFull%",
	},
	{
		"api.timeout": 5,
		"production.id": 0,
		"productions.id": [],
	},
	"dmc-lk",
);

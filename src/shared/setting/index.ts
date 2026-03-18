import { Setting } from "./Setting";

export * from "./Config";
export * from "./Setting";

export const $setting = new Setting(
	{
		"api.host": "https://dmc-mact.ru/lk_api/v1/",
		"api.timeout": 5,
		"base.url": "/lk",
		"production.id": 0,
		size: "15",
		limits: ["15", "30", "50", "75", "100"],
		formatDate: "DD.MM.YYYY",
		formatTime: "HH:mm",
		formatTimeFull: "HH:mm:ss",
		formatDateTime: "%formatDate% %formatTime%",
		formatDateTimeFull: "%formatDate% %formatTimeFull%",
	},
	{
		"api.host": import.meta.env.DEV
			? "http://10.76.10.145:5054/lk_api/v1/"
			: "https://dmc-mact.ru/lk_api/v1/",
		// "api.host": "https://dmc-mact.ru/lk_api/v1/",
		"api.timeout": 5,
		"base.url": import.meta.env.DEV ? "/" : "/lk",
		"production.id": 0,
	},
	"dmc-lk",
);

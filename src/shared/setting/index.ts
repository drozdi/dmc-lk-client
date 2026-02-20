import { Setting } from "./Setting";

export * from "./Config";
export * from "./Setting";

export const $setting = new Setting(
	{
		"api.host": "https://dmc-mact.ru/lk_api/v1/",
		"api.timeout": 10,
		"base.url": "/",
		"product.id": 0,
		formatDate: "DD.MM.YYYY",
		formatTime: "HH:mm",
		formatTimeFull: "HH:mm:ss",
		formatDateTime: "%formatDate% %formatTime%",
		formatDateTimeFull: "%formatDate% %formatTimeFull%",
	},
	{
		"api.host": "http://10.76.10.145:5054/lk_api/v1/",
		"api.timeout": 10,
		"base.url": "/",
		"product.id": 0,
	},
	"dmc-lk",
);

export const mapStep: Record<string, string> = {
	s: "секунда",
	m: "минута",
	h: "час",
	d: "день",
	mon: "месяц",
	y: "год",
};

export const mapEvents: Record<
	AnalyticEvent,
	{
		label: string;
		color: string;
	}
> = {
	v: {
		label: "верифицировано",
		color: "#00ff84",
	},
	i: {
		label: "инцидент",
		color: "#ff6384",
	},
	d: {
		label: "дефект",
		color: "#35a2eb",
	},
	p: {
		label: "печать",
		color: "#006384",
	},
};

// export const mapEvent: Record<AnalyticEvent, string> = Object.fromEntries(
// 	Object.entries(mapEvents).map(([key, { label }]) => [key as AnalyticEvent, label]),
// );
// export const mapEventColor: Record<AnalyticEvent, string> = Object.fromEntries(
// 	Object.entries(mapEvents).map(([key, { color }]) => [key as AnalyticEvent, color]),
// );

export const mapEvent: Record<AnalyticEvent, string> = {
	v: "верифицировано",
	i: "инцидент",
	d: "дефект",
	p: "печать",
};

export const mapEventColor: Record<AnalyticEvent, string> = {
	v: "#00ff84",
	i: "#ff6384",
	d: "#35a2eb",
	p: "#006384",
};

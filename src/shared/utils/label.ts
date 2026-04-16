import { cached } from "./cached";

export const labelName = cached<string>((name: string): string => {
	const res =
		/(?:[Ww])(?<w>[0-9,.\s]*)(?:[Hh])(?<h>[0-9,.\s]*)(?:[Gg]*).*/.exec(name);
	if (!res) {
		return name;
	}
	res.groups.w = parseInt(String(res.groups.w).replaceAll(/[\s]*/g, ""), 10);
	res.groups.h = parseInt(String(res.groups.h).replaceAll(/[\s]*/g, ""), 10);

	return `${res.groups.w}x${res.groups.h}`;
});

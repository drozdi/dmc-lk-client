import dayjs from "dayjs";

export function formatTimestampByStep(
	timestamp: string,
	step: SliceStep,
): string {
	const value = dayjs(timestamp);

	if (step === "s") {
		return value.format("HH:mm:ss");
	}
	if (step === "m") {
		return value.format("mm");
	}
	if (step === "h") {
		return value.format("HH");
	}

	return value.format("YYYY-MM-DD");
}

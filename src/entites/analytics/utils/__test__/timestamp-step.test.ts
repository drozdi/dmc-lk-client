import { describe, expect, it } from "vitest";
import { formatTimestampByStep } from "@/entites/analytics/utils/timestamp-step";

describe("formatTimestampByStep", () => {
	const timestamp = "2025-06-15T14:35:42";

	it("formats seconds and minutes", () => {
		expect(formatTimestampByStep(timestamp, "s")).toBe("14:35:42");
		expect(formatTimestampByStep(timestamp, "m")).toBe("35");
	});

	it("formats hours", () => {
		expect(formatTimestampByStep(timestamp, "h")).toBe("14");
	});

	it("formats day-level steps as date", () => {
		expect(formatTimestampByStep(timestamp, "d")).toBe("2025-06-15");
		expect(formatTimestampByStep(timestamp, "w")).toBe("2025-06-15");
		expect(formatTimestampByStep(timestamp, "mon")).toBe("2025-06-15");
	});
});

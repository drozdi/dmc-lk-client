import { describe, expect, it } from "vitest";
import {
	getAnalyticsQueryKey,
	isAnalyticsBaseQueryReady,
	isAnalyticsQueryReady,
	normalizeAnalyticsParams,
	serializeAnalyticsParamsKey,
} from "@/entites/analytics/utils/analytics-query";

const baseParams: Partial<IRequestAnalytics> = {
	filterdate: ["2025-06-01", "2025-06-07"],
	step: "d",
	event: "p",
	production_id: [1, 2],
};

describe("analytics-query", () => {
	it("checks base query readiness without event", () => {
		expect(isAnalyticsBaseQueryReady(baseParams)).toBe(true);
		expect(
			isAnalyticsBaseQueryReady({ ...baseParams, production_id: [] }),
		).toBe(false);
	});

	it("checks full query readiness with event", () => {
		expect(isAnalyticsQueryReady(baseParams)).toBe(true);
		expect(isAnalyticsQueryReady({ ...baseParams, event: undefined })).toBe(
			false,
		);
	});

	it("builds stable query keys", () => {
		const normalized = normalizeAnalyticsParams(baseParams);
		expect(normalized).not.toBeNull();
		expect(getAnalyticsQueryKey(normalized)).toEqual([
			"analytics",
			"2025-06-01",
			"2025-06-07",
			"d",
			"p",
			"1",
			"2",
		]);
		expect(serializeAnalyticsParamsKey(baseParams)).toContain("analytics");
	});

	it("returns idle key for invalid params", () => {
		expect(getAnalyticsQueryKey(null)).toEqual(["analytics", "idle"]);
		expect(normalizeAnalyticsParams({ filterdate: [null, null] })).toBeNull();
	});
});

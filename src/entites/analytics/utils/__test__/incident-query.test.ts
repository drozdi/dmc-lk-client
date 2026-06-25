import { describe, expect, it } from "vitest";
import {
	getIncidentQueryKey,
	isIncidentParamsReady,
	normalizeIncidentParams,
	serializeIncidentParamsKey,
} from "@/entites/analytics/utils/incident-query";

describe("incident-query", () => {
	it("normalizes filterdate and data arrays", () => {
		const params = normalizeIncidentParams({
			filterdate: ["2025-06-01", "2025-06-07"],
			data: "incident-a",
			fields_name: ["field"],
		});

		expect(params).toEqual({
			filterdate: ["2025-06-01", "2025-06-07"],
			data: ["incident-a"],
			fields_name: ["field"],
		});
	});

	it("returns null when filterdate is incomplete", () => {
		expect(normalizeIncidentParams({ filterdate: ["2025-06-01", ""] })).toBeNull();
	});

	it("builds incident query keys", () => {
		const params = normalizeIncidentParams({
			filterdate: ["2025-06-01", "2025-06-07"],
			data: ["a", "b"],
		});

		expect(getIncidentQueryKey(params)).toEqual([
			"incident",
			"2025-06-01",
			"2025-06-07",
			"a",
			"b",
		]);
		expect(serializeIncidentParamsKey({ filterdate: ["2025-06-01", "2025-06-07"] })).toContain(
			"incident",
		);
	});

	it("checks readiness", () => {
		expect(
			isIncidentParamsReady({
				filterdate: ["2025-06-01", "2025-06-07"],
			}),
		).toBe(true);
		expect(isIncidentParamsReady({ filterdate: ["", ""] })).toBe(false);
	});
});

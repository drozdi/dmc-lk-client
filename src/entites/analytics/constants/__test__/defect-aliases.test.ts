import { describe, expect, it } from "vitest";
import {
	classifyDefect,
	DEFECT_CATEGORY_WRONG_AGGREGATE_LEVEL,
} from "@/entites/analytics/constants/defect-aliases";

describe("classifyDefect", () => {
	it("maps known substring aliases", () => {
		expect(classifyDefect("Ошибка: Ручная отбраковка на линии")).toBe(
			"Ручная отбраковка",
		);
	});

	it("maps duplicate recently scanned separately from wrong aggregate level", () => {
		expect(
			classifyDefect(
				"Дубликат кода Код ABC был недавно отканирован на линии",
			),
		).toBe("Дубликат кода: Код был недавно отканирован");

		expect(
			classifyDefect(
				"Некорректный код агрегата! Код XYZ от другого уровня в составе",
			),
		).toBe(DEFECT_CATEGORY_WRONG_AGGREGATE_LEVEL);
	});

	it("does not classify wrong aggregate level as recently scanned", () => {
		const wrongLevel =
			"Некорректный код агрегата! Код ITEM от другого уровня";
		expect(classifyDefect(wrongLevel)).not.toBe(
			"Дубликат кода: Код был недавно отканирован",
		);
		expect(classifyDefect(wrongLevel)).toBe(
			DEFECT_CATEGORY_WRONG_AGGREGATE_LEVEL,
		);
	});

	it("returns ERROR for unknown codes", () => {
		expect(classifyDefect("Неизвестная ошибка принтера")).toBe("ERROR");
	});
});

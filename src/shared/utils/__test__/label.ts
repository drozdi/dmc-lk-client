import { labelName } from "../label";

describe("@/shared/utils/label", () => {
	test("labelName(name)", () => {
		expect(labelName("W60H40G1")).toBe("60x40");
		expect(labelName("W60H40G2")).toBe("60x40");
		expect(labelName("W60H40G3")).toBe("60x40");
		expect(labelName("W58H40G2")).toBe("58x40");
		expect(labelName("W58H40G3")).toBe("58x40");
		expect(labelName("W100H100G2")).toBe("100x100");
		expect(labelName("W100H100G3")).toBe("100x100");

		expect(labelName("W60,60H40,60G1")).toBe("60x40");
		expect(labelName("W60.40H40.60G2")).toBe("60x40");
		expect(labelName("W60,39H40.60G3")).toBe("60x40");
		expect(labelName("W58,39H40,900G2")).toBe("58x40");
		expect(labelName("W58,39H40,G3")).toBe("58x40");
		expect(labelName("W100,39H100G2")).toBe("100x100");
		expect(labelName("W100H100,39G3")).toBe("100x100");
	});
});

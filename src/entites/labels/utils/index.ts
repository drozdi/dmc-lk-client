import { cached, randomColor } from "@/shared/utils";
import { mapLabelColor, mapLabelColors } from "../constants";

let i = 0;

export const randomColorLabel = cached<string>(
	(name: string, type: string = "label") => {
		let color = mapLabelColor[name];
		if (!color) {
			i = (i + 1) % mapLabelColors.length;
			color = mapLabelColors[i];
		}
		return color || randomColor();
	},
);

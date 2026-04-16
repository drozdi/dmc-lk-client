import { cached, randomColor } from "@/shared/utils";
import { mapLabelColor, mapLabelColors } from "../constants";

export const randomColorLabel = cached<string>(
	(name: string, type: string = "label") => {
		let color = mapLabelColor[name];
		if (!color) {
			color = mapLabelColors[Math.floor(Math.random() * mapLabelColors.length)];
		}
		return color || randomColor();
	},
);

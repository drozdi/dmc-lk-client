import { labelName } from "@/shared/utils/label";
import {
	factory,
	Tooltip,
	useProps,
	type Factory,
	type TooltipProps,
} from "@mantine/core";

export interface LabelFormatProps extends Omit<
	TooltipProps,
	"label" | "children"
> {
	children: string;
	tooltip?: boolean;
}
export type LabelFormatFactory = Factory<{
	props: LabelFormatProps;
	ref: HTMLDivElement;
}>;

export const LabelFormat = factory<LabelFormatFactory>(
	({
		children: _children,
		tooltip: _tooltip,
		..._props
	}: LabelFormatProps) => {
		const { children, tooltip } = useProps(
			"LabelFormat",
			{ tooltip: false },
			{ children: _children, tooltip: _tooltip },
		);
		const format = labelName(children);
		if (tooltip && format !== children) {
			return (
				<Tooltip label={children} {..._props}>
					<span>{format}</span>
				</Tooltip>
			);
		}
		return format;
	},
);

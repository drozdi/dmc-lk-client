import { labelName } from "@/shared/utils/label";
import { Tooltip } from "@mantine/core";

export function LabelFormat({
	children,
	tooltip = true,
}: {
	children: string;
	tooltip?: boolean;
}) {
	const format = labelName(children);
	if (tooltip && format !== children) {
		return (
			<Tooltip label={children}>
				<span>{labelName(children)}</span>
			</Tooltip>
		);
	}
	return labelName(children);
}

import { LabelsGroup } from "@/features/labels/lables-group";
import { Paper } from "@mantine/core";
import { Template } from "@t";

export function LabelsPage() {
	return (
		<Paper>
			<Template.Title>Групировка этикеток</Template.Title>
			<LabelsGroup />
		</Paper>
	);
}

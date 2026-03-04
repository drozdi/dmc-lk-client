import { useConsumptions, useGrouped } from "@/entites/labels";
import { LabelsGroup } from "@/features/labels/lables-group";
import { Template } from "@/layout";
import { Paper } from "@mantine/core";

export function LabelsPage() {
	console.log(useGrouped());
	console.log(useConsumptions());
	return (
		<Paper>
			<Template.Title>Групировка этикеток</Template.Title>
			<LabelsGroup />
		</Paper>
	);
}

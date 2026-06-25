import { useStoreCountLabel, useStoreLabels } from "@/entites/labels";
import { SelectProductions } from "@/entites/users";
import { LabelsGroup } from "@/features/labels/lables-group";
import { LabelsGroupAdd } from "@/features/labels/lables-group-add";
import { Template } from "@/layout";
import { $setting } from "@/shared";
import { Text } from "@/shared/ui";
import { Group, Paper } from "@mantine/core";
import { useEffect } from "react";

export function LabelsPage() {
	const storeLabels = useStoreLabels();
	const storeCountLabel = useStoreCountLabel();
	useEffect(() => {
		storeLabels.load();
		storeCountLabel.load();
	}, []);

	const [production_id, setProduction_id] = $setting.useState(
		"labels.group.production_id",
		0,
	);

	return (
		<Paper>
			<Template.Title>Группировка этикеток</Template.Title>
			<Group justify="space-between">
				<Group>
					<Text>Производство:</Text>
					<SelectProductions
						excludeds={["0"]}
						variant="underline"
						value={String(production_id)}
						onChange={(value) => setProduction_id(Number(value))}
					/>
				</Group>
				<LabelsGroupAdd production_id={production_id} />
			</Group>
			<LabelsGroup mt="xs" production_id={production_id} />
		</Paper>
	);
}

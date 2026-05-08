import { LabelsHistory } from "@/features/labels/lables-history";

import { Template } from "@/layout";
import { Paper } from "@mantine/core";

export function LabelsHistoryPage() {
	return (
		<Paper>
			<Template.Title>Операции по этикеткам</Template.Title>
			<LabelsHistory />
		</Paper>
	);
}

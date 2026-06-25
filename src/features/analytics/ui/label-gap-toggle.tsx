import { Checkbox, Group, Tooltip } from "@mantine/core";

export interface LabelGapToggleProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
}

export function LabelGapToggle({ checked, onChange }: LabelGapToggleProps) {
	return (
		<Group gap="0" justify="flex-end">
			<Tooltip label="Учитывать зазор между этикетками">
				<Checkbox
					onChange={(e) => onChange(e.target.checked)}
					checked={checked}
					label="Группировать по Gap"
				/>
			</Tooltip>
		</Group>
	);
}

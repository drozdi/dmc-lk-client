import { Group, Text, Tooltip } from "@mantine/core";
import { TbInfoCircle } from "react-icons/tb";

interface FieldWrapProps {
	children: React.ReactNode;
	label?: string;
	description?: string;
}

export function FieldWrap({ children, label, description }: FieldWrapProps) {
	return (
		<Group justify="space-between" align="flex-start">
			{(label || description) && (
				<Group flex={1} justify="space-between">
					{label && <Text flex={1}>{label}</Text>}
					{description && (
						<Tooltip label={description}>
							<TbInfoCircle />
						</Tooltip>
					)}
				</Group>
			)}

			{children}
		</Group>
	);
}

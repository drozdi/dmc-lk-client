import { Center, Stack, Text, ThemeIcon, type StackProps } from "@mantine/core";
import { TbChartBarOff } from "react-icons/tb";

export interface EmptyStateProps extends StackProps {
	title: React.ReactNode;
	description?: React.ReactNode;
	icon?: React.ReactNode;
}

export function EmptyState({
	title,
	description,
	icon = (
		<ThemeIcon size={48} radius="xl" variant="light" color="gray">
			<TbChartBarOff size={24} />
		</ThemeIcon>
	),
	...props
}: EmptyStateProps) {
	return (
		<Center w="100%" h="100%" mih={120} p="md">
			<Stack align="center" gap="sm" ta="center" c="dimmed" maw={420} {...props}>
				{icon}
				<Text fw={600} size="lg" c="dimmed">
					{title}
				</Text>
				{description ? (
					<Text size="sm" c="dimmed">
						{description}
					</Text>
				) : null}
			</Stack>
		</Center>
	);
}

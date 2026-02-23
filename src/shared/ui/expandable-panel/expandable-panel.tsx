import {
	Box,
	Button,
	Group,
	LoadingOverlay,
	Modal,
	Paper,
	ScrollArea,
	Stack,
	type BoxProps,
} from "@mantine/core";
import { useState } from "react";
import { TbArrowsMaximize, TbArrowsMinimize } from "react-icons/tb";

export interface ExpandablePanelProps extends BoxProps {
	title: React.ReactNode;
	loading?: boolean;
	keepMounted?: boolean;
	children: React.ReactNode;
	component?: any;
}

export function ExpandablePanel({
	title,
	loading = false,
	children,
	keepMounted = true,
	component,
	...otherProps
}: ExpandablePanelProps) {
	// Управляем состоянием компонента
	const [isExpanded, setIsExpanded] = useState(false);

	// Обработчик переключения состояния
	const toggleExpanded = () => {
		setIsExpanded((v) => !v);
	};

	return (
		<Paper
			shadow="xl"
			p="xs"
			component={Stack}
			justify="space-between"
			{...otherProps}
			style={{
				...otherProps.style,
				position: "relative",
				overflow: "hidden",
			}}
		>
			<Group justify="space-between" mb="xs">
				<Box fw={500} flex="1">
					{title}
				</Box>
				<Button
					variant="subtle"
					size="compact-xs"
					onClick={toggleExpanded}
					rightSection={
						isExpanded ? (
							<TbArrowsMinimize size="1rem" />
						) : (
							<TbArrowsMaximize size="1rem" />
						)
					}
				>
					{isExpanded ? "Свернуть" : "Развернуть"}
				</Button>
			</Group>
			{/* Содержимое компонента */}
			{(keepMounted || isExpanded) && (
				<Box
					component={component}
					mih={loading ? 300 : undefined}
					miw={loading ? 300 : undefined}
					h="100%"
				>
					<LoadingOverlay visible={loading} zIndex={1000} />
					<Modal
						opened={isExpanded}
						onClose={() => setIsExpanded(false)}
						title={title}
						size="100vw"
						scrollAreaComponent={ScrollArea.Autosize}
					>
						{children}
					</Modal>
					{children}
				</Box>
			)}
		</Paper>
	);
}

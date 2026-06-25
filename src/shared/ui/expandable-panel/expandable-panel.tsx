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
import { memo, useCallback, useState } from "react";
import { TbArrowsMaximize, TbArrowsMinimize } from "react-icons/tb";

export interface ExpandablePanelProps extends BoxProps {
	title: React.ReactNode;
	loading?: boolean;
	keepMounted?: boolean;
	children: React.ReactNode;
	component?: any;
}

function ExpandablePanelRoot({
	title,
	loading = false,
	children,
	keepMounted = true,
	component,
	...otherProps
}: ExpandablePanelProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	const toggleExpanded = useCallback(() => {
		setIsExpanded((value) => !value);
	}, []);

	const closeExpanded = useCallback(() => {
		setIsExpanded(false);
	}, []);

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
						onClose={closeExpanded}
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

export const ExpandablePanel = memo(ExpandablePanelRoot);

import {
	Box,
	Button,
	Group,
	LoadingOverlay,
	Modal,
	Paper,
	ScrollArea,
	Text,
} from "@mantine/core";
import { useState } from "react";
import { TbArrowsMaximize, TbArrowsMinimize } from "react-icons/tb";

export function ExpandablePanel({
	title,
	loading = false,
	children,
	keepMounted = true,
	component,
	...otherProps
}: {
	title: React.ReactElement;
	loading?: boolean;
	keepMounted?: boolean;
	children: React.ReactNode;
	component?: any;
}) {
	// Управляем состоянием компонента
	const [isExpanded, setIsExpanded] = useState(false);

	// Обработчик переключения состояния
	const toggleExpanded = () => {
		setIsExpanded((v) => !v);
	};

	return (
		<>
			<Modal
				opened={isExpanded}
				onClose={() => setIsExpanded(false)}
				title={title}
				size="100vw"
				scrollAreaComponent={ScrollArea.Autosize}
			>
				{children}
			</Modal>
			<Paper
				shadow="xl"
				p="xs"
				{...otherProps}
				style={{
					position: "relative",
					width: "100%",
					height: "auto",
					zIndex: 1,
					overflow: "hidden",
				}}
			>
				<LoadingOverlay visible={loading} zIndex={1000} />
				<Group justify="space-between" mb="xs">
					<Text fw={500}>{title}</Text>
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
					>
						{children}
					</Box>
				)}
			</Paper>
		</>
	);
}

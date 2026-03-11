import {
	ActionIcon,
	Card,
	Group,
	LoadingOverlay,
	Modal,
	ScrollArea,
	Text,
	Tooltip,
	type CardProps,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { TbArrowsMaximize, TbArrowsMinimize } from "react-icons/tb";

export interface WidgetProps extends CardProps {
	title: React.ReactNode;
	loading?: boolean;
	keepMounted?: boolean;
	children: React.ReactNode;
	preview?: React.ReactNode;
	component?: any;
}

export function Widget({
	title,
	loading = false,
	children,
	preview = children,
	keepMounted = true,
	component = ScrollArea,
	...otherProps
}: WidgetProps) {
	const [isExpanded, { open, close, toggle }] = useDisclosure(false);

	return (
		<Card
			shadow="xl"
			p="xs"
			w="100%"
			h="100%"
			bd="1px solid var(--mantine-color-default-border)"
			{...otherProps}
			style={{
				position: "relative",
				overflow: "hidden",
				...otherProps?.style,
			}}
		>
			<Card.Section inheritPadding py="xs" className={"drag-handle"}>
				<Group justify="space-between">
					<Text fw={500} flex="1">
						{title}
					</Text>
					<Group mr="-xs">
						<Tooltip label={isExpanded ? "Свернуть" : "Развернуть"}>
							<ActionIcon variant="subtle" onClick={toggle}>
								{isExpanded ? <TbArrowsMinimize /> : <TbArrowsMaximize />}
							</ActionIcon>
						</Tooltip>
					</Group>
				</Group>
			</Card.Section>
			<Card.Section
				inheritPadding
				component={component}
				mih={loading ? "100%" : undefined}
				miw={loading ? "100%" : undefined}
				h="100%"
				pos="relative"
			>
				{keepMounted || isExpanded ? preview : null}
				<LoadingOverlay visible={loading} zIndex={1000} />
			</Card.Section>
			<Modal
				opened={isExpanded}
				onClose={close}
				title={title}
				size="100vw"
				scrollAreaComponent={ScrollArea.Autosize}
			>
				{children}
			</Modal>
		</Card>
	);
}

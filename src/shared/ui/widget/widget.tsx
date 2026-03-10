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
import { TbArrowsMaximize, TbArrowsMinimize, TbX } from "react-icons/tb";

export interface WidgetProps extends CardProps {
	title: React.ReactNode;
	loading?: boolean;
	keepMounted?: boolean;
	dragable?: boolean;
	children: React.ReactNode;
	component?: any;
	onRemove?: () => void;
}

export function Widget({
	onRemove,
	title,
	loading = false,
	children,
	keepMounted = true,
	component = ScrollArea,
	dragable = false,
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
			<Card.Section
				inheritPadding
				py="xs"
				className={dragable ? "drag-handle" : ""}
			>
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
						{onRemove && (
							<Tooltip label="Убрать">
								<ActionIcon color="red" variant="subtle" onClick={onRemove}>
									<TbX />
								</ActionIcon>
							</Tooltip>
						)}
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
				{keepMounted || isExpanded ? children : null}
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

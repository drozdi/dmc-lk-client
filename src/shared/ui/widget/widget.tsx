import {
	ActionIcon,
	Card,
	Group,
	LoadingOverlay,
	Modal,
	ScrollArea,
	Tooltip,
	type CardProps,
} from "@mantine/core";

import { Text, Title } from "@/shared/ui";

import { useDisclosure } from "@mantine/hooks";
import { TbArrowsMaximize, TbArrowsMinimize } from "react-icons/tb";

export interface WidgetProps extends CardProps {
	title: React.ReactNode;
	subTitle?: React.ReactNode;
	loading?: boolean;
	keepMounted?: boolean;
	children: React.ReactNode;
	preview?: React.ReactNode;
	component?: any;
	expanded?: boolean;
}

export function Widget({
	title,
	subTitle,
	loading = false,
	children,
	preview = children,
	keepMounted = true,
	component = ScrollArea,
	expanded = true,
	...otherProps
}: WidgetProps) {
	const [isExpanded, { open, close, toggle }] = useDisclosure(false);

	return (
		<Card
			shadow="xl"
			p="xs"
			w="100%"
			h="100%"
			withBorder
			{...otherProps}
			style={{
				position: "relative",
				overflow: "hidden",
				...otherProps?.style,
			}}
		>
			<Card.Section inheritPadding py="xs" className={"drag-handle"} withBorder>
				<Group justify="space-between">
					<Title fw={500} lh="1" flex="1" order={6} tt="uppercase">
						{title}
					</Title>

					{expanded && (
						<Group mr="-xs">
							<Tooltip label={isExpanded ? "Свернуть" : "Развернуть"}>
								<ActionIcon variant="subtle" onClick={toggle}>
									{isExpanded ? <TbArrowsMinimize /> : <TbArrowsMaximize />}
								</ActionIcon>
							</Tooltip>
						</Group>
					)}
				</Group>
				<Text fw={500} lh="1" flex="1">
					{subTitle}
				</Text>
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

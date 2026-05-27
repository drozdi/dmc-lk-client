import {
	ActionIcon,
	Card,
	Group,
	LoadingOverlay,
	Menu,
	Modal,
	ScrollArea,
	type CardProps,
	type MenuItemProps
} from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
import { TbArrowsMaximize, TbArrowsMinimize, TbDots, TbFileDownload } from "react-icons/tb";
import { ButtonIcon } from '../button';
import { Text } from "../text";
import { Title } from "../title";
import { ProviderWidget, useWidget } from "./context";

export interface WidgetMenuItem extends MenuItemProps {}

export interface WidgetMenuProps {
	options?: ({
		onClick: () => void;
	} & WidgetMenuItem)[];
}
export interface WidgetProps extends CardProps {
	title: React.ReactNode;
	subTitle?: React.ReactNode;
	loading?: boolean;
	keepMounted?: boolean;
	children: React.ReactNode;
	preview?: React.ReactNode;
	component?: any;
	expanded?: boolean;
	menu?: ({
		onClick: () => void;
	} & WidgetMenuItem)[];
	onDownload?: () => void;
	error?: React.ReactNode | IError;
	wraped?: boolean;
}

function WidgetMenu({ options = [] }: WidgetMenuProps) {
	if (!options?.length) {
		return null;
	}
	return (
		<Menu withinPortal trigger="hover" position="bottom-start" shadow="sm">
			<Menu.Target>
				<ActionIcon variant="subtle">
					<TbDots size={16} />
				</ActionIcon>
			</Menu.Target>
			<Menu.Dropdown>
				{options.map((item) => (
					<Menu.Item key={item.children as string} {...item} />
				))}
			</Menu.Dropdown>
		</Menu>
	);
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
	error,
	menu = [],
	wraped = true,
	onDownload,
	...otherProps
}: WidgetProps) {
	const [isExpanded, { open, close, toggle }] = useDisclosure(false);
	const ctx = useWidget();
	return ctx || !wraped ? (
		children
	) : (
		<ProviderWidget isExpanded={isExpanded}>
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
				<Card.Section
					inheritPadding
					py="xs"
					className={"drag-handle"}
					withBorder
				>
					<Group justify="space-between">
						<Title fw={500} lh="1" flex="1" order={6} tt="uppercase">
							{title}
						</Title>
						{(expanded || menu?.length || onDownload) && (
							<Group mr="-xs" gap="0">
								{onDownload && <ButtonIcon tooltip="Скаачать" variant="subtle" onClick={onDownload}>
									<TbFileDownload />
								</ButtonIcon>}
								{menu?.length && <WidgetMenu options={menu} />}
								{expanded && (
									<ButtonIcon tooltip={isExpanded ? "Свернуть" : "Развернуть"} variant="subtle" onClick={toggle}>
										{isExpanded ? <TbArrowsMinimize /> : <TbArrowsMaximize />}
									</ButtonIcon>
								)}
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
					pb="md"
					type="always"
				>
					<Text c="red">{error?.message || error}</Text>
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
					<Text c="red">{error?.message || error}</Text>
					{children}
				</Modal>
			</Card>
		</ProviderWidget>
	);
}

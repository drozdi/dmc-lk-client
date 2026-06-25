import {
	ActionIcon,
	Card,
	Group,
	Menu,
	Modal,
	ScrollArea,
	type CardProps,
	type MenuItemProps
} from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
import { memo, useMemo } from "react";
import { TbArrowsMaximize, TbArrowsMinimize, TbDots, TbFileDownload } from "react-icons/tb";
import { ButtonIcon } from '../button';
import { ChartSkeleton } from "../skeleton";
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
	loadingSkeleton?: React.ReactNode;
}

const DEFAULT_LOADING_SKELETON = <ChartSkeleton height="100%" mih={180} />;

const WidgetMenu = memo(function WidgetMenu({ options = [] }: WidgetMenuProps) {
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
});

function WidgetRoot({
	title,
	subTitle,
	loading = false,
	children,
	preview,
	keepMounted = true,
	component = ScrollArea,
	expanded = true,
	error,
	menu = [],
	wraped = true,
	onDownload,
	loadingSkeleton = DEFAULT_LOADING_SKELETON,
	...otherProps
}: WidgetProps) {
	const [isExpanded, { close, toggle }] = useDisclosure(false);
	const ctx = useWidget();
	const cardStyle = useMemo(
		() => ({
			position: "relative" as const,
			overflow: "hidden" as const,
			...otherProps?.style,
		}),
		[otherProps?.style],
	);
	const previewContent = preview ?? children;

	if (ctx || !wraped) {
		return children;
	}

	return (
		<ProviderWidget isExpanded={isExpanded}>
			<Card
				shadow="xl"
				p="xs"
				w="100%"
				h="100%"
				withBorder
				{...otherProps}
				style={cardStyle}
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
								{onDownload && <ButtonIcon tooltip="Скачать" variant="subtle" onClick={onDownload}>
									<TbFileDownload />
								</ButtonIcon>}
								{menu?.length ? <WidgetMenu options={menu} /> : null}
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
					{loading ? loadingSkeleton : keepMounted || isExpanded ? previewContent : null}
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

export const Widget = memo(WidgetRoot);

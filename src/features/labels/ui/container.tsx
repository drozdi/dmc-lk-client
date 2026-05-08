import { Text } from "@/shared/ui";
import { ActionIcon, Card, Group, Menu, type MenuItemProps } from "@mantine/core";
import { forwardRef, type Ref } from 'react';
import { TbDots } from "react-icons/tb";

export interface ContainerProps { children: React.ReactNode, title?: React.ReactNode, label: string, menu?: MenuItemProps[] }

function ContainerMenu({ options = [] }: {
	options?: MenuItemProps[]
}) {
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
export const Container = forwardRef(({ children, label, menu = [], title, ...props }: ContainerProps, ref: Ref<HTMLDivElement>) => {
	return <Card withBorder {...props } ref={ref}>
		<Card.Section withBorder inheritPadding py="xs">
      		<Group justify="space-between">
				<Text fw={500}>
					{label}
				</Text>
				<ContainerMenu options={menu} />
			</Group>
		</Card.Section>
		{title && <Card.Section inheritPadding withBorder>
			{title}
		</Card.Section>}
		<Card.Section inheritPadding withBorder>
			{children}
		</Card.Section>
	</Card>
})
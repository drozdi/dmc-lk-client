import { ActionIcon, Popover } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { TbSettings } from "react-icons/tb";
import { WidgetForm } from "./form/widget-form";

export interface AddWidgetProps {
	
}

export function AddWidget({ }: AddWidgetProps) {
	const [opened, { close, toggle }] = useDisclosure(false);
	return (
		<Popover opened={opened} onDismiss={close} width={500}>
			<Popover.Target>
				<ActionIcon onClick={toggle} variant="outline">
					<TbSettings />
				</ActionIcon>
			</Popover.Target>
			<Popover.Dropdown>
				<WidgetForm
					onSave={() => {
						close();
					}}
				/>
			</Popover.Dropdown>
		</Popover>
	);
}

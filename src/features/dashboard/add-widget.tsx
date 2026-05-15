import { ActionIcon, Popover } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { TbSettings } from "react-icons/tb";
import { type StoreApi, type UseBoundStore } from "zustand";
import { WidgetForm } from "./form/widget-form";

interface AddWidgetProps {
	store: UseBoundStore<StoreApi<WidgetContextType>>;
}

export function AddWidget({ store: useStore }: AddWidgetProps) {
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
					store={useStore}
					onSave={() => {
						close();
					}}
				/>
			</Popover.Dropdown>
		</Popover>
	);
}

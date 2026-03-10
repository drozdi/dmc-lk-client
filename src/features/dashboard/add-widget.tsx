import { ActionIcon, Popover } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { TbSettings } from "react-icons/tb";
import { type StoreApi, type UseBoundStore } from "zustand";
import { WidgetForm } from "./widget-form";

interface AddWidgetProps {
	store: UseBoundStore<StoreApi<DashboardContextType>>;
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
					onAdd={() => {
						close();
					}}
				/>
			</Popover.Dropdown>
		</Popover>
	);
}

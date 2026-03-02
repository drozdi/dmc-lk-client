import { ActionIcon, Popover } from "@mantine/core";
import { TbSettings } from "react-icons/tb";
import { type StoreApi, type UseBoundStore } from "zustand";
import { WidgetForm } from "./widget-form";

interface AddWidgetProps {
	store: UseBoundStore<StoreApi<DashboardContextType>>;
}

export function AddWidget({ store: useStore }: AddWidgetProps) {
	return (
		<Popover width={500}>
			<Popover.Target>
				<ActionIcon variant="outline">
					<TbSettings />
				</ActionIcon>
			</Popover.Target>
			<Popover.Dropdown>
				<WidgetForm store={useStore} />
			</Popover.Dropdown>
		</Popover>
	);
}

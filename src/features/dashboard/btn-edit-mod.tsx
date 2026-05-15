import { ActionIcon, Group } from "@mantine/core";
import { TbEdit } from "react-icons/tb";
import { type StoreApi, type UseBoundStore } from "zustand";

interface BtnClearProps {
	store: UseBoundStore<StoreApi<WidgetContextType>>;
}

export function BtnEditMode({ store: useStore }: BtnClearProps) {
	const store = useStore();
	return (
		<Group>
			<ActionIcon
				color={store.edit ? "green" : ""}
				onClick={() => store.toggleEdit()}
			>
				<TbEdit />
			</ActionIcon>
		</Group>
	);
}

import { ActionIcon, Group } from "@mantine/core";
import { TbRestore } from "react-icons/tb";
import { type StoreApi, type UseBoundStore } from "zustand";

interface BtnClearProps {
	store: UseBoundStore<StoreApi<WidgetContextType>>;
}

export function BtnClear({ store: useStore }: BtnClearProps) {
	const store = useStore();
	return (
		<Group>
			<ActionIcon onClick={() => store.reset()}>
				<TbRestore />
			</ActionIcon>
		</Group>
	);
}

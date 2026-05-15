import { ActionIcon, Group } from "@mantine/core";
import { TbEdit } from "react-icons/tb";

export interface BtnClearProps {

}

export function BtnEditMode({ }: BtnClearProps) {
	//const store = useDashboard();
	return (
		<Group>
			<ActionIcon
				//color={store.edit ? "green" : ""}
				onClick={() => {
					// store.toggleEdit()
				}}
			>
				<TbEdit />
			</ActionIcon>
		</Group>
	);
}

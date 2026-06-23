import { useDashboard } from "@/entites/dashboard";
import { ActionIcon, Group } from "@mantine/core";
import { TbEdit } from "react-icons/tb";

export interface BtnClearProps {
	dashboard?: WidgetContextType
}

export function BtnEditMode({ dashboard = useDashboard() }: BtnClearProps) {
	return (
		<Group>
			<ActionIcon
				color={dashboard.edit ? "green" : ""}
				onClick={() => {
					dashboard.toggleEdit()
				}}
			>
				<TbEdit />
			</ActionIcon>
		</Group>
	);
}

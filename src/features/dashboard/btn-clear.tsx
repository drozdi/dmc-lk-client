import { useDashboard } from "@/entites/dashboard";
import { ActionIcon, Group } from "@mantine/core";
import { TbRestore } from "react-icons/tb";

export interface BtnClearProps {
	dashboard?: WidgetContextType
}

export function BtnClear({ dashboard = useDashboard()}: BtnClearProps) {
	return (
		<Group>
			<ActionIcon onClick={() => {
				dashboard.reset()
			}}>
				<TbRestore />
			</ActionIcon>
		</Group>
	);
}

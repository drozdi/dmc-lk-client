import { ActionIcon, Group } from "@mantine/core";
import { TbRestore } from "react-icons/tb";

export interface BtnClearProps {

}

export function BtnClear({}: BtnClearProps) {
	//const store = useDashboard();
	return (
		<Group>
			<ActionIcon onClick={() => {
				// store.reset()
				}}>
				<TbRestore />
			</ActionIcon>
		</Group>
	);
}

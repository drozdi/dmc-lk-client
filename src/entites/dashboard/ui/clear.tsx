import { ActionIcon, Group } from "@mantine/core";
import { TbRestore } from "react-icons/tb";
import { useDashboard } from "../context";

export function ClearBtn() {
	const dashboard = useDashboard();

	return (
		<Group>
			{/* <ActionIcon onClick={() => dashboard.reset()}>
				<TbReload />
			</ActionIcon> */}
			<ActionIcon onClick={() => dashboard.clear()}>
				<TbRestore />
			</ActionIcon>
		</Group>
	);
}

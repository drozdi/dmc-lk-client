import { ActionIcon, Tooltip, type ActionIconProps } from "@mantine/core";
import { TbCircleX } from "react-icons/tb";

export interface ButtonRemoveProps extends ActionIconProps {
	tooltip?: string;
	onClick?: () => void;
}

export function ButtonRemove({
	children = <TbCircleX />,
	tooltip = "Удалить",
	...props
}: ButtonRemoveProps) {
	return (
		<Tooltip disabled={!tooltip} label={tooltip}>
			<ActionIcon color="red" {...props}>
				{children}
			</ActionIcon>
		</Tooltip>
	);
}

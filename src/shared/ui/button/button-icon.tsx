import { ActionIcon, type ActionIconProps, Tooltip } from "@mantine/core";
import { Icon } from "../icon/icon";

interface ButtonIconProps extends ActionIconProps {
	tooltip?: string;
}

export function ButtonIcon({ children, tooltip, ...props }: ButtonIconProps) {
	return (
		<Tooltip disabled={!tooltip} label={tooltip}>
			<ActionIcon {...props}>
				<Icon>{children}</Icon>
			</ActionIcon>
		</Tooltip>
	);
}

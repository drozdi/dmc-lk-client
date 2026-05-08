import { ActionIcon, type ActionIconProps, Tooltip } from "@mantine/core";

export interface ButtonIconProps extends ActionIconProps {
	tooltip?: string;
	onClick?: () => void;
}

export function ButtonIcon({ children, tooltip, ...props }: ButtonIconProps) {
	return (
		<Tooltip disabled={!tooltip} label={tooltip}>
			<ActionIcon {...props}>
				{children}
			</ActionIcon>
		</Tooltip>
	);
}

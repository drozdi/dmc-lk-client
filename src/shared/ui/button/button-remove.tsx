import { TbCircleX } from "react-icons/tb";
import { ButtonIcon, type ButtonIconProps } from "./button-icon";

export interface ButtonRemoveProps extends ButtonIconProps {}

export function ButtonRemove({
	children = <TbCircleX />,
	...props
}: ButtonRemoveProps) {
	return <ButtonIcon color='red' {...props}>
		{children}
	</ButtonIcon>;
}

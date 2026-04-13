import {
	Title as MantineTitle,
	type TitleProps as MantineTitleProps,
} from "@mantine/core";

export interface TitleProps extends MantineTitleProps {}

export function Title({ children, ...props }: TitleProps) {
	if (children) {
		return <MantineTitle {...props}>{children}</MantineTitle>;
	}
	return "";
}

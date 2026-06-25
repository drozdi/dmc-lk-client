import {
	Title as MantineTitle,
	type TitleProps as MantineTitleProps,
} from "@mantine/core";
import { memo } from "react";

export interface TitleProps extends MantineTitleProps {}

function TitleRoot({ children, ...props }: TitleProps) {
	if (children) {
		return <MantineTitle {...props}>{children}</MantineTitle>;
	}
	return "";
}

export const Title = memo(TitleRoot);

import {
	Text as MantineText,
	type TextProps as MantineTextProps,
} from "@mantine/core";
import { memo } from "react";

export interface TextProps extends MantineTextProps {
	children?: React.ReactNode;
}

function TextRoot({ children, ...props }: TextProps) {
	if (children) {
		return <MantineText {...props}>{children}</MantineText>;
	}
	return "";
}

export const Text = memo(TextRoot);

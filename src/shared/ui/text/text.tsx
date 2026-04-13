import {
	Text as MantineText,
	type TextProps as MantineTextProps,
} from "@mantine/core";

export interface TextProps extends MantineTextProps {
	children?: React.ReactNode;
}

export function Text({ children, ...props }: TextProps) {
	if (children) {
		return <MantineText {...props}>{children}</MantineText>;
	}
	return "";
}

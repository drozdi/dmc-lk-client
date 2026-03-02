import { Textarea, type TextareaProps } from "@mantine/core";

interface FieldTextProps extends TextareaProps {}
export function FieldText({ ...props }: FieldTextProps) {
	return <Textarea flex={1} {...props} />;
}

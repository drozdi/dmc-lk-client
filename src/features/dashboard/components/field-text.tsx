import { Textarea, type TextareaProps } from "@mantine/core";

interface FieldTextProps extends TextareaProps {}
export function FieldText({ onChange, ...props }: FieldTextProps) {
	return (
		<Textarea
			flex={1}
			{...props}
			onChange={({ target }) => {
				onChange(target.value);
			}}
		/>
	);
}

import { TextInput, type TextInputProps } from "@mantine/core";

interface FieldStringProps extends Omit<TextInputProps, "onChange"> {
	onChange: (value: string) => void;
}
export function FieldString({ onChange, ...props }: FieldStringProps) {
	return (
		<TextInput
			flex={1}
			{...props}
			onChange={({ target }) => {
				onChange(target.value);
			}}
		/>
	);
}

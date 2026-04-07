import { TextInput, type TextInputProps } from "@mantine/core";
import { FieldWrap, type FieldWrapProps } from "./field-wrarp";

export interface FieldStringProps
	extends
		Omit<FieldWrapProps, "children" | "onChange" | "value" | "defaultValue">,
		Omit<TextInputProps, "onChange" | "description" | "label" | "type"> {
	onChange: (value: string) => void;
}

export function FieldString({
	type,
	store,
	label,
	description,
	required,
	onChange,
	...props
}: FieldStringProps) {
	return (
		<FieldWrap
			type={type}
			store={store}
			label={label}
			description={description}
			required={required}
			value={props.value}
			defaultValue={props.defaultValue}
			onChange={onChange}
		>
			<TextInput
				{...props}
				required={required}
				onChange={({ target }) => {
					onChange(target.value);
				}}
			/>
		</FieldWrap>
	);
}

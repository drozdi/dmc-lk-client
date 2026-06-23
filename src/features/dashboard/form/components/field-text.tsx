import { Textarea, type TextareaProps } from "@mantine/core";
import { FieldWrap, type FieldWrapProps } from "./field-wrarp";

export interface FieldTextProps
	extends
		Omit<FieldWrapProps, "children" | "onChange" | "value" | "defaultValue">,
		Omit<TextareaProps, "onChange" | "description" | "label" | "type"> {
	onChange: (value: string) => void;
}

export function FieldText({
	type,
	label,
	description,
	required,
	onChange,
	...props
}: FieldTextProps) {
	return (
		<FieldWrap
			type={type}
			label={label}
			description={description}
			required={required}
			value={props.value}
			defaultValue={props.defaultValue}
			onChange={onChange}
		>
			<Textarea
				{...props}
				onChange={({ target }) => {
					onChange(target.value);
				}}
			/>
		</FieldWrap>
	);
}

import { NumberInput, type NumberInputProps } from "@mantine/core";
import { FieldWrap, type FieldWrapProps } from "./field-wrarp";

export interface FieldNumberProps
	extends
		Omit<FieldWrapProps, "children" | "onChange" | "value" | "defaultValue">,
		Omit<NumberInputProps, "description" | "label" | "type"> {}

export function FieldNumber({
	type,
	label,
	description,
	required,
	...props
}: FieldNumberProps) {
	return (
		<FieldWrap
			type={type}
			label={label}
			description={description}
			required={required}
			value={props.value}
			defaultValue={props.defaultValue}
			onChange={props.onChange}
		>
			<NumberInput required={required} {...props} />
		</FieldWrap>
	);
}

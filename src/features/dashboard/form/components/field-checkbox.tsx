import { Checkbox, type CheckboxProps } from "@mantine/core";
import { FieldWrap, type FieldWrapProps } from "./field-wrarp";

export interface FieldCheckboxProps
	extends
		Omit<FieldWrapProps, "children" | "onChange" | "value" | "defaultValue">,
		Omit<CheckboxProps, "description" | "label" | "type"> {}

export function FieldCheckbox({
	type,
	store,
	label,
	description,
	required,
	...props
}: FieldCheckboxProps) {
	return (
		<FieldWrap
			type={type}
			store={store}
			label={label}
			description={description}
			required={required}
			value={props.value}
			defaultValue={props.defaultValue}
			onChange={props.onChange}
		>
			<Checkbox required={required} {...props} />
		</FieldWrap>
	);
}

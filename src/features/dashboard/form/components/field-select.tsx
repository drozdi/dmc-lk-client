import { Select, type SelectProps } from "@mantine/core";
import { FieldWrap, type FieldWrapProps } from "./field-wrarp";

export interface FieldSelectProps
	extends
		Omit<FieldWrapProps, "children" | "onChange" | "value" | "defaultValue">,
		Omit<SelectProps, "onChange" | "description" | "label" | "type"> {
	onChange: (value: string) => void;
}

export function FieldSelect({
	type,
	label,
	description,
	required,
	onChange,
	...props
}: FieldSelectProps) {
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
			<Select
				{...props}
				onChange={(...args) => onChange?.(...args)}
				required={required}
			/>
		</FieldWrap>
	);
}

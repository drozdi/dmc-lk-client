import { MultiSelect, type MultiSelectProps } from "@mantine/core";
import { FieldWrap, type FieldWrapProps } from "./field-wrarp";

export interface FieldSelectArrayProps
	extends
		Omit<FieldWrapProps, "children" | "onChange" | "value" | "defaultValue">,
		Omit<MultiSelectProps, "onChange" | "description" | "label" | "type"> {
	onChange: (value: string) => void;
}

export function FieldSelectArray({
	type,
	label,
	description,
	required,
	onChange,
	...props
}: FieldSelectArrayProps) {
	return (
		<FieldWrap
			type={type}
			label={label}
			description={description}
			required={required}
			value={props.value}
			defaultValue={props.defaultValue}
			onChange={onChange}
			error={props.error}
		>
			<MultiSelect
				{...props}
				onChange={onChange}
				required={required}
			/>
		</FieldWrap>
	);
}

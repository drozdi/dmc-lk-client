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
	store,
	label,
	description,
	required,
	onChange,
	...props
}: FieldSelectArrayProps) {
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
			<MultiSelect
				{...props}
				onChange={(...args) => onChange?.(...args)}
				required={required}
			/>
		</FieldWrap>
	);
}

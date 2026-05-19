import { DualCalendarRange } from "@/shared/ui";
import { DateInput, type DateInputProps } from "@mantine/dates";
import { FieldWrap, type FieldWrapProps } from "./field-wrarp";

export interface FieldDateProps
	extends
		Omit<FieldWrapProps, "children" | "onChange" | "value" | "defaultValue">,
		Omit<DateInputProps, "description" | "label" | "type"> {}

export function FieldDate({
		type,
		label,
		description,
		required,
		...props
	}: FieldDateProps) {
	return (
		<FieldWrap
			type={type}
			label={label}
			description={description}
			required={required}
			value={props.value}
			defaultValue={props.defaultValue}
			onChange={props.onChange}
			error={props.error}
		>
			{type.endsWith("range") ? (
				<DualCalendarRange required={required} {...props} />
			) : (
				<DateInput required={required} {...props} />
			)}
		</FieldWrap>
	);
}

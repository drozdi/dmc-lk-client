import { Select, type SelectProps } from "@mantine/core";

export function SignForm({
	value = "",
	onChange,
	...props
}: SelectProps & {
	value?: string;
	onChange?: (value: string) => void;
}) {
	return (
		<Select
			{...props}
			value={String(value)}
			onChange={(value) => onChange?.(value as string)}
			data={["=", ">=", "<=", "!=", "in", "not_in", "like"]}
		/>
	);
}

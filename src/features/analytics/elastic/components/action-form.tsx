import { Select, type SelectProps } from "@mantine/core";
export function ActionForm({
	value = "",
	onChange,
	...props
}: SelectProps & { value?: string; onChange?: (value: string) => void }) {
	return (
		<Select
			{...props}
			value={String(value)}
			onChange={(value) => onChange?.(value as string)}
			data={["and", "or", "not"]}
		/>
	);
}

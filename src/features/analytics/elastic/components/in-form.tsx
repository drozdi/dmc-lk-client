import { TagsInput } from "@mantine/core";

export function InForm({
	values,
	onChange,
}: {
	values?: string[];
	onChange?: (values: string[]) => void;
}) {
	return (
		<TagsInput value={values} onChange={onChange} placeholder="Enter поиск" />
	);
}

import { NumberInput, type NumberInputProps } from "@mantine/core";

interface FieldNumberProps extends NumberInputProps {}

export function FieldNumber({ ...props }: FieldNumberProps) {
	return <NumberInput flex={1} {...props} />;
}

import {
	ColorSwatch,
	Group,
	NumberFormatter,
	Stack,
	Text,
} from "@mantine/core";
import { type DefaultLegendContentProps } from "recharts";

export function LegendContentPie(props: DefaultLegendContentProps) {
	const { payload } = props;
	return (
		<Stack
			bg="var(--mantine-color-body)"
			bd="1px solid var(--mantine-color-default-border)"
			p="xs"
			gap="0"
			maw={256}
		>
			{" "}
			{(payload || []).map(({ value, color, payload }) => (
				<Group key={value}>
					<ColorSwatch color={color as string} size={12} />
					<Text
						flex="1"
						style={{
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						}}
					>
						{value}
					</Text>
					<NumberFormatter value={payload.value} />
				</Group>
			))}
		</Stack>
	);
}

import { Box, ColorSwatch, Group, NumberFormatter, Text } from "@mantine/core";
import { type TooltipContentProps } from "recharts";

export function TooltipContentPie(props: TooltipContentProps) {
	const { payload, separator, formatter = (value) => NumberFormatter({
		value
	}) } = props;
	console.log(props)
	if (!payload[0]) {
		return null;
	}

	const { color, name, value, nameKey, dataKey } = payload[0];

	return (
		<Group
			bg="var(--mantine-color-body)"
			bd="1px solid var(--mantine-color-default-border)"
			p="xs"
			w={256}
			justify="space-between"
		>
			<ColorSwatch color={color as string} size={12} />
			<Text flex="1">{name}</Text>
			{formatter(value)}
		</Group>
	);
}

export function TooltipContentBar(props: TooltipContentProps) {
	const { active, payload, separator, label, labelFormatter } = props;
	if (active && payload && payload.length) {
		return (
			<Box
				bg="var(--mantine-color-body)"
				bd="1px solid var(--mantine-color-default-border)"
				p="xs"
				w={256}
			>
				<p>{labelFormatter?.(label) || label}</p>
				<Group justify="space-between">
					<Text flex="1">Всего</Text>
					<NumberFormatter
						value={payload.reduce((acc, { value }) => acc + value, 0)}
					/>
				</Group>

				{payload.map(({ color, name, value, hide, payload }) => (
					<Group
						key={name}
						justify="space-between"
						style={{
							textDecoration: hide ? "line-through" : undefined,
						}}
					>
						<ColorSwatch
							color={color || payload.color || (payload.fill as string)}
							size={12}
						/>
						<Text flex="1">{name}</Text>
						<NumberFormatter value={value} />
					</Group>
				))}
			</Box>
		);
	}
	return null;
}

import {
	ColorSwatch,
	Group,
	NumberFormatter,
	Stack,
	Text,
} from "@mantine/core";
import { useCallback, useState } from "react";
import { type DefaultLegendContentProps, type LegendPayload } from "recharts";

export function LegendContentPieFactory(name?: string) {
	return (props: DefaultLegendContentProps) => {
		const { payload, formatter = (value: any, entry: LegendPayload, index: number) => NumberFormatter({
			value
		}), onClick } = props;
		const [hover, setHover] = useState('')
		const handleMouseEnter = useCallback((name: string) => {
			if (onClick) {
				setHover(name)
			}
		}, [onClick])
		const handleMouseLeave = useCallback(() => {
			setHover('')
		}, [onClick])
		return (
			<Stack
				bg="var(--mantine-color-body)"
				bd="1px solid var(--mantine-color-default-border)"
				p="xs"
				gap="0"
			>
				{(payload || []).map((entry, index) => {
					const { value, color, payload } = entry
					return <Group key={value} onClick={(e) => onClick?.(entry, index, e)} style={{
						borderBottom: value === name || hover === value? "2px dashed var(--mantine-color-default-border)": "",
					}} onMouseLeave={handleMouseLeave} onMouseEnter={() => handleMouseEnter(value)}>
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
						{formatter(payload?.value, entry, index)}
					</Group>
				})}
			</Stack>
		);
	}
}

export const LegendContentPie = LegendContentPieFactory()

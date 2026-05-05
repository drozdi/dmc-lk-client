import { LabelFormat, Text } from '@/shared/ui';
import { Group, NumberFormatter } from "@mantine/core";
import { forwardRef } from "react";
import { TbList } from "react-icons/tb";

export interface ItemProps {
	children: string
	sum: number;
	sum_consumption: number;
}

export const Item = forwardRef(({ children, sum, sum_consumption,...props }: ItemProps, ref) => {
	return <Group justify="space-between" {...props} ref={ref}>
		<div>
			<TbList />
		</div>
		<Text>
			<LabelFormat>{children}</LabelFormat>
		</Text>
		<Text>
			<NumberFormatter value={sum} />
		</Text>
		<Text>
			<NumberFormatter value={sum_consumption} />
		</Text>
	</Group>
})
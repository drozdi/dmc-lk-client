import { Text } from '@/shared/ui';
import { Box, Group, NumberFormatter, Stack } from "@mantine/core";
import { forwardRef, type Ref } from "react";
import { TbList } from "react-icons/tb";

export interface ItemProps {
	children: string
	cnt?: number;
	len?: number;
}

export const Item = forwardRef(({ children, cnt, len,...others }: ItemProps, ref:Ref<HTMLDivElement>) => {
	const props: Record<string, any> = {}
	const listeners: Record<string, any> = {}
	
	Object.entries(others).forEach(([key, value]) => {
		if (key.startsWith('on')) {
			listeners[key] = value
		} else {
			props[key] = value
		}
	})
	
	const isDrag = Object.entries(listeners).length > 0
	
	return <Stack gap='0' {...props} ref={ref}>
		<Group grow>
			{isDrag && <Box flex='0' {...listeners} style={{
				cursor: 'var(--cursor)'
			}}>
				<TbList />
			</Box>}
			<Text flex='1' maw='100%' ta='left'>
				{children}
			</Text>
		</Group>
		<Group grow align='flex-start'>
			{cnt && <div>
				Количество: <NumberFormatter value={cnt} />
			</div>}
			{len && <div>
				Метраж: <NumberFormatter value={len} />
			</div>}
	</Group>
	</Stack>
})
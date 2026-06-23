import { Text } from '@/shared/ui';
import { Center, Stack } from '@mantine/core';
import { TbDatabaseOff } from 'react-icons/tb';

type DataTableEmptyStateProps = React.PropsWithChildren<{
  Icon?: React.FC<any> | undefined;
  text?: string;
}>;

export function TableEmpty({ Icon = TbDatabaseOff, text, children }: DataTableEmptyStateProps) {
  return (
  	<Center w='100%' h='100%' p='lg'>
		{children || (<Stack align='center'>
        	<Text fz='6rem' c="dimmed"><Icon /></Text>
			<Text c="dimmed" fz="h2" ta="center">
				{text}
			</Text>
        </Stack>)}
    </Center>
  );
}
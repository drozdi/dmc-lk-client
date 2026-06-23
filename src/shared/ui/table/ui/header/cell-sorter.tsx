import { ActionIcon } from '@mantine/core';
import {
	TbChevronDown,
	TbChevronUp,
	TbSelector
} from 'react-icons/tb';
import { useTableDataContext } from '../../context/TableDataContext';
import type { TableHeaderCellSorterProps } from '../type';

export function TableHeaderCellSorter<T = object>({
	column,
	...props
}: TableHeaderCellSorterProps<T>) {
	if (!column.isSorted || !column.field) {
		return null;
	}
	const { sort, changeSort } = useTableDataContext<T>();

	const isSorted = sort.key === column.field;
	const isDescending = sort.descending;

	const ariaLabel = isSorted
		? `Отсортировано ${isDescending ? 'по убыванию' : 'по возрастанию'}`
		: 'Нажмите для сортировки'; // <-- Улучшение: призыв к действию

	const handleClick = (event: React.MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		if (column.field) {
			changeSort(column.field as keyof T);
		}
	};

	return (
		<ActionIcon
			{...props}
			variant="subtle"
			flex="0"
			onClick={handleClick}
			title={ariaLabel}
			aria-label={ariaLabel}
		>
			{isSorted ? isDescending ? <TbChevronDown /> : <TbChevronUp /> : <TbSelector />}
		</ActionIcon>
	);
}
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
	const { sort, changeSort, multiSort } = useTableDataContext<T>();

	const ruleIndex = sort.rules.findIndex((rule) => rule.key === column.field);
	const isSorted = ruleIndex !== -1;
	const isDescending = isSorted ? sort.rules[ruleIndex].descending : sort.descending;

	const ariaLabel = isSorted
		? `Отсортировано ${isDescending ? 'по убыванию' : 'по возрастанию'}${multiSort && sort.rules.length > 1 ? ` (приоритет ${ruleIndex + 1})` : ''}`
		: 'Нажмите для сортировки';

	const handleClick = (event: React.MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		if (column.field) {
			changeSort(column.field as keyof T, { multi: event.shiftKey || multiSort });
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

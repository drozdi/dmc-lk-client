import { useCallback, useState } from 'react';
import type { TableNode, TableStorage } from '../type';

export function useNodeSelect<T = object>(
	nodes: TableNode<T>[],
	storage?: TableStorage,
	initialSelectedRows?: TableNode<T>['index'][],
	onInitialSelectedRowsChange?: (rows: TableNode<T>['index'][]) => void,
) {
	const [internalSelectedRows, setInternalSelectedRows] = useState<
		TableNode<T>['index'][]
	>(() => {
		if (initialSelectedRows) {
			return initialSelectedRows;
		}
		return (storage?.getItem('nodes.selected') as TableNode<T>['index'][] | null) ?? [];
	});

	const selectedRows = initialSelectedRows ?? internalSelectedRows;

	const setSelectedRows = useCallback(
		(
			newSelected:
				| TableNode<T>['index'][]
				| ((prev: TableNode<T>['index'][]) => TableNode<T>['index'][]),
		) => {
			if (initialSelectedRows !== undefined) {
				const resolved =
					typeof newSelected === 'function'
						? newSelected(initialSelectedRows)
						: newSelected;
				onInitialSelectedRowsChange?.(resolved);
				return;
			}

			setInternalSelectedRows((prev) => {
				const resolved =
					typeof newSelected === 'function' ? newSelected(prev) : newSelected;
				storage?.setItem('nodes.selected', resolved);
				onInitialSelectedRowsChange?.(resolved);
				return resolved;
			});
		},
		[initialSelectedRows, onInitialSelectedRowsChange, storage],
	);

	const isRowSelected = useCallback(
		(index: TableNode<T>['index']) => selectedRows?.includes(index),
		[selectedRows],
	);

	const toggleRow = useCallback(
		(index: TableNode<T>['index']) => {
			setSelectedRows((prev) => {
				const idx = prev.indexOf(index);
				if (idx === -1) {
					return [...prev, index];
				}
				return prev.filter((i) => i !== index);
			});
		},
		[setSelectedRows],
	);

	const selectAll = useCallback(
		(selected: boolean) => {
			const indices = nodes.map((node) => node.index);
			setSelectedRows(selected ? indices : []);
		},
		[nodes, setSelectedRows],
	);

	const someSelected = !!(selectedRows?.length && selectedRows.length < nodes.length);
	const allSelected = nodes.length > 0 && selectedRows?.length === nodes.length;

	return {
		selectedRows,
		toggleRow,
		selectAll,
		isRowSelected,
		someSelected,
		allSelected,
	};
}

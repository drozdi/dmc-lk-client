import { useDebouncedCallback } from '@mantine/hooks';
import { useCallback, useMemo, useState } from 'react';
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

	const persistSelectedRows = useDebouncedCallback(
		(rows: TableNode<T>['index'][]) => {
			storage?.setItem('nodes.selected', rows);
		},
		300,
	);

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
				persistSelectedRows(resolved);
				onInitialSelectedRowsChange?.(resolved);
				return resolved;
			});
		},
		[initialSelectedRows, onInitialSelectedRowsChange, persistSelectedRows],
	);

	const selectedSet = useMemo(() => new Set(selectedRows), [selectedRows]);

	const isRowSelected = useCallback(
		(index: TableNode<T>['index']) => selectedSet.has(index),
		[selectedSet],
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

	const someSelected = useMemo(
		() => !!(selectedRows.length && selectedRows.length < nodes.length),
		[selectedRows.length, nodes.length],
	);

	const allSelected = useMemo(
		() => nodes.length > 0 && selectedRows.length === nodes.length,
		[selectedRows.length, nodes.length],
	);

	return {
		selectedRows,
		toggleRow,
		selectAll,
		isRowSelected,
		someSelected,
		allSelected,
	};
}

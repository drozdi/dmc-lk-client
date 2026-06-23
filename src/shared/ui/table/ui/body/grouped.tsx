import { useMemo } from 'react';
import { useTableDataContext } from '../../context';
import { getGroupedColumnForLevel, getNodeExpandKey, groupChildrenForExpand } from '../../utils/group-by';
import type { TableBodyGroupedProps } from '../type';
import { TableBodyRow } from './row';

export function TableBodyGrouped<T = object>({ node, columns, level = 0 }: TableBodyGroupedProps<T>) {
	const { isExpanded, groupKeys, multiGroup, props: tableProps, colspan, groupAt } =
		useTableDataContext<T>();

	const parentLevel = node.groupLevel ?? 0;
	const expandKey = getNodeExpandKey(node);
	const isExpand = isExpanded(expandKey, 'grouped');

	const group = useMemo(() => columns.find((col) => col.isGroup), [columns]);

	const childNodes = useMemo(() => {
		if (!isExpand) {
			return [];
		}
		const children = node.nodes || [];
		if (!multiGroup || groupKeys.length <= 1) {
			return children;
		}
		return groupChildrenForExpand(children, groupKeys, parentLevel, expandKey);
	}, [isExpand, node.nodes, multiGroup, groupKeys, parentLevel, expandKey]);

	const groupedColumn = useMemo(
		() => getGroupedColumnForLevel(columns, groupKeys, parentLevel + 1),
		[columns, groupKeys, parentLevel],
	);

	if (!isExpand || !childNodes.length) {
		return null;
	}

	const nestedLevel = level + 1;
	const useNestedTable = multiGroup && groupKeys.length > 1;

	const renderRows = () =>
		childNodes.map((child) => (
			<TableBodyRow<T>
				key={getNodeExpandKey(child)}
				node={child}
				columns={columns}
				level={nestedLevel}
				group={group}
				grouped={groupedColumn}
			/>
		));

	if (!useNestedTable) {
		return <>{renderRows()}</>;
	}

	return renderRows();
}

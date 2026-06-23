import type { ColumnEntity, TableNode } from '../type';

export function buildExpandKey(
	parentKey: string | undefined,
	groupLevel: number,
	groupValue: unknown,
): string {
	const segment = `${groupLevel}:${String(groupValue)}`;
	return parentKey ? `${parentKey}/${segment}` : segment;
}

export function getNodeExpandKey(node: Pick<TableNode, 'expandKey' | 'index'>): string {
	return node.expandKey ?? String(node.index);
}

export function groupBy<T = object>(
	nodes: TableNode<T>[],
	key: keyof T | undefined,
	groupLevel?: number,
	parentExpandKey?: string,
): TableNode<T>[] {
	if (!key) {
		return nodes;
	}
	const groups = new Map<T[keyof T], TableNode<T>[]>();
	for (const node of nodes) {
		const groupValue = node.data[key];
		if (!groups.has(groupValue)) {
			groups.set(groupValue, []);
		}
		groups.get(groupValue)!.push(node);
	}
	const result: TableNode<T>[] = [];
	for (const group of groups.values()) {
		if (group?.length === 0) {
			continue;
		}
		const [first, ...rest] = group;
		const parent = first as TableNode<T>;
		const groupValue = parent.data[key];
		parent.nodes = rest.map((child) => {
			child.isChildren = true;
			return child;
		});
		parent.isChildren = false;
		parent.isParent = rest.length > 0;
		if (groupLevel !== undefined) {
			parent.groupLevel = groupLevel;
			parent.expandKey = buildExpandKey(parentExpandKey, groupLevel, groupValue);
		}
		for (const child of rest) {
			child.isParent = false;
		}
		result.push(parent);
	}

	return result;
}

/** Группировка только по первому ключу (верхний уровень). */
export function groupByFirstKey<T = object>(
	nodes: TableNode<T>[],
	keys: (keyof T)[],
): TableNode<T>[] {
	if (!keys.length) {
		return nodes;
	}
	return groupBy(nodes, keys[0], 0);
}

/**
 * При раскрытии родителя на уровне `parentGroupLevel` группирует детей
 * по следующему ключу или возвращает листья без группировки.
 */
export function groupChildrenForExpand<T = object>(
	children: TableNode<T>[],
	groupKeys: (keyof T)[],
	parentGroupLevel: number,
	parentExpandKey?: string,
): TableNode<T>[] {
	const nextKeyIndex = parentGroupLevel + 1;
	const nextKey = groupKeys[nextKeyIndex];
	if (!nextKey || !children.length) {
		return children;
	}
	return groupBy(children, nextKey, nextKeyIndex, parentExpandKey);
}

export function canExpandGroupedNode<T = object>(
	node: TableNode<T>,
	groupKeys: (keyof T)[],
): boolean {
	return !!node.isParent && (node.nodes?.length ?? 0) > 0 && groupKeys.length > 0;
}

export function getGroupedColumnLevel<T>(
	column: ColumnEntity<T>,
	groupKeys: (keyof T)[],
): number {
	if (!column.isGrouped || !column.field) {
		return -1;
	}
	return groupKeys.indexOf(column.field as keyof T);
}

/** Отступ grouped-колонки: каждый следующий уровень groupKeys смещается глубже. */
export function getGroupedColumnPadding<T = object>(
	column: ColumnEntity<T>,
	columnLevel: number,
): string | undefined {
	if (columnLevel < 0 || !column.isGrouped) {
		return undefined;
	}
	const base = 'var(--table-horizontal-spacing, 0.5rem)';
	const step = 'var(--mantine-spacing-md)';
	if (columnLevel === 0) {
		return base;
	}
	return `calc(${step} * ${columnLevel} + ${base})`;
}

export function getGroupedColumnForLevel<T>(
	columns: ColumnEntity<T>[],
	groupKeys: (keyof T)[],
	level: number,
): ColumnEntity<T> | undefined {
	const key = groupKeys[level];
	if (!key) {
		return columns.find((column) => column.isGrouped);
	}
	return columns.find((column) => column.isGrouped && column.field === key);
}

export function getGroupItemsField<T>(
	column: Pick<ColumnEntity<T>, 'isGroup' | 'isGrouped' | 'field' | 'groupItemsField'>,
): keyof T | undefined {
	if (!column.isGroup || !column.field) {
		return undefined;
	}
	if (column.groupItemsField) {
		return column.groupItemsField;
	}
	if (!column.isGrouped) {
		return column.field as keyof T;
	}
	return `${String(column.field)}Items` as keyof T;
}

export function getGroupNestedData<T>(node: TableNode<T>, column: ColumnEntity<T>): T[] {
	const itemsField = getGroupItemsField(column);
	if (!itemsField) {
		return [];
	}
	const value = node.data[itemsField];
	return Array.isArray(value) ? (value as T[]) : [];
}

export function hasGroupNestedData<T>(node: TableNode<T>, column: ColumnEntity<T>): boolean {
	return getGroupNestedData(node, column).length > 0;
}

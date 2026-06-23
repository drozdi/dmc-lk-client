import { type TableNode } from '../type';

export function groupBy<T = object>(
	nodes: TableNode<T>[],
	key: keyof T | undefined,
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
		(first as TableNode<T>).nodes = rest.map((child) => {
			child.isChildren = true;
			return child;
		});
		(first as TableNode<T>).isParent = (rest?.length || 0) > 0;
		result.push(first as TableNode<T>);
	}

	return result;
}

/**
 * Многоуровневая группировка: последовательно применяет groupBy по каждому ключу.
 * Первый ключ — верхний уровень, следующие — вложенные группы в node.nodes.
 */
export function groupByKeys<T = object>(
	nodes: TableNode<T>[],
	keys: (keyof T)[],
): TableNode<T>[] {
	if (!keys.length) {
		return nodes;
	}
	const [firstKey, ...restKeys] = keys;
	const grouped = groupBy(nodes, firstKey);
	if (!restKeys.length) {
		return grouped;
	}
	return grouped.map((parent) => ({
		...parent,
		nodes: parent.nodes?.length ? groupByKeys(parent.nodes, restKeys) : parent.nodes,
	}));
}

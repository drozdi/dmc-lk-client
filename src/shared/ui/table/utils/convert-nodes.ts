import { type TableNode } from '../type';

export function convertNodes<T = object>(items: T[]): TableNode<T>[] {
	return Object.entries(items).map(([index, item]) => ({
		data: item,
		index,
		expandKey: index,
		isParent: false,
		isChildren: false,
		nodes: [],
	}));
}
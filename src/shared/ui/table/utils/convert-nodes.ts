import { type TableNode } from '../TableData';

export function convertNodes<T = object>(items: T[]): TableNode<T>[] {
	return Object.entries(items).map(([index, item]) => ({
		data: item,
		index,
		isParent: false,
		isChildren: false,
		nodes: [],
	}));
}
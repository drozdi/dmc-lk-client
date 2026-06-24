import { type TableNode } from '../type';

export function convertNodes<T = object>(items: T[]): TableNode<T>[] {
	return items.map((item, index) => ({
		data: item,
		index,
		expandKey: String(index),
		isParent: false,
		isChildren: false,
		nodes: [],
	}));
}
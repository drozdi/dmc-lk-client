import { type TableNode } from '../TableData';

export function sortBy<T = object>(nodes: TableNode<T>[], key: keyof T, descending = false): TableNode<T>[] {
	let result = [...nodes];
	const fn = ({ data: a }: TableNode<T>, { data: b }: TableNode<T>) => {
		if (a[key] > b[key]) {
			return descending ? -1 : 1;
		}
		if (a[key] < b[key]) {
			return descending ? 1 : -1;
		}
		return 0;
	};
	result.sort(fn);
	return result.map((val) => {
		Array.isArray(val.nodes) && val.nodes.sort(fn);
		return val;
	});
}
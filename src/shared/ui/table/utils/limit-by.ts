import { type TableNode } from '../TableData';

export function limitBy<T = object>(nodes: TableNode<T>[], limit: number, offset: number): TableNode<T>[] {
	return nodes.slice((offset-1)*limit, offset*limit)
}
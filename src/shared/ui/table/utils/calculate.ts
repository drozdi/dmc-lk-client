import { Children } from 'react';
import type { ColumnEntity } from '../type';

type Child = React.ReactNode

export function calculateColspan(children: Child | Child[]): number {
	if (!children) {
		return 1;
	}
	return Children.toArray(children).reduce<number>((sum, child) => {
		return sum + calculateColspan(child?.props?.children);
	}, 0);
};
export function calculateIsColumns(children?: Child): boolean {
	if (!children) {
		return false;
	}
	return Children.count(children) > 0;
};

export function resolveColumnFlag<T>(
	value: boolean | ((column: ColumnEntity<T>) => boolean | void) | undefined,
	column: ColumnEntity<T>,
): boolean {
	if (typeof value === 'function') {
		return value(column) !== false;
	}
	return !!value;
}
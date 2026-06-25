import type { ColumnEntity } from '../type';
import { compareByColumnOrder } from './column-order-index';

export const ROOT_COLUMN_GROUP = '__root__';

/** Листовые колонки для tbody (раскрывает вложенные isColumns). */
export function flattenBodyColumns<T>(columns: ColumnEntity<T>[]): ColumnEntity<T>[] {
	const result: ColumnEntity<T>[] = [];
	for (const column of columns) {
		if (column.isColumns && column.columns.length > 0) {
			result.push(...flattenBodyColumns(column.columns));
			continue;
		}
		result.push(column);
	}
	return result;
}

export function getHeaderCellKey<T>(column: ColumnEntity<T>): string {
	if (column.field) {
		return String(column.field);
	}
	if (column.isSelecting) {
		return '__select__';
	}
	if (column.isHoverSlot) {
		return '__hover_slot__';
	}
	if (column.isActions) {
		return '__actions__';
	}
	return `header-${column.level}-${String(column.header ?? column.colspan)}`;
}

export function resolveColumnGroupKey<T>(column: ColumnEntity<T>): string {
	return column.columnGroupKey ?? ROOT_COLUMN_GROUP;
}

/** Заголовок группы колонок (не перетаскивается). */
export function isColumnGroupHeader<T>(column: ColumnEntity<T>): boolean {
	return column.isColumns && column.isHeader;
}

/** Поле участвует в перестановке порядка колонок внутри своей группы. */
export function isColumnOrderReorderable<T>(column: ColumnEntity<T>): boolean {
	return (
		!!column.field &&
		column.isField &&
		!column.isGroup &&
		!column.isGrouped &&
		!column.isSelecting &&
		!column.isActions &&
		!column.isHoverSlot &&
		!isColumnGroupHeader(column)
	);
}

export function buildFieldGroupMap<T>(columns: ColumnEntity<T>[]): Map<keyof T, string> {
	const map = new Map<keyof T, string>();

	function walk(cols: ColumnEntity<T>[], groupKey: string) {
		for (const column of cols) {
			const nextGroupKey =
				column.isColumns && column.isHeader ? getHeaderCellKey(column) : groupKey;

			if (column.isColumns && column.columns.length > 0) {
				walk(column.columns, nextGroupKey);
				continue;
			}

			if (column.field && column.isField) {
				map.set(column.field as keyof T, groupKey);
			}
		}
	}

	walk(columns, ROOT_COLUMN_GROUP);
	return map;
}

/** Сортировка порядка колонок: заголовки групп на месте, поля — только внутри группы. */
export function orderColumnsTree<T>(
	columns: ColumnEntity<T>[],
	orderIndex: Map<keyof T, number> | null,
): ColumnEntity<T>[] {
	const ordered = columns.map((column) => {
		if (column.isColumns && column.columns.length > 0) {
			return {
				...column,
				columns: orderColumnsTree(column.columns, orderIndex),
			};
		}
		return column;
	});

	if (!orderIndex) {
		return ordered;
	}

	const reorderableIndexes: number[] = [];
	for (let index = 0; index < ordered.length; index++) {
		if (isColumnOrderReorderable(ordered[index]!)) {
			reorderableIndexes.push(index);
		}
	}

	if (reorderableIndexes.length <= 1) {
		return ordered;
	}

	const reorderable = reorderableIndexes.map((index) => ordered[index]!);
	reorderable.sort((a, b) =>
		compareByColumnOrder(a.field as keyof T, b.field as keyof T, orderIndex),
	);

	const result = [...ordered];
	reorderableIndexes.forEach((index, position) => {
		result[index] = reorderable[position]!;
	});
	return result;
}

/** Поля колонок, участвующие в порядке / скрытии / ширине / сортировке. */
export function getColumnFields<T>(columns: ColumnEntity<T>[]): (keyof T)[] {
	const result: (keyof T)[] = [];
	for (const column of columns) {
		if (column.isColumns && column.columns.length > 0) {
			result.push(...getColumnFields(column.columns));
			continue;
		}
		if (
			column.field &&
			column.isField &&
			!column.isSelecting &&
			!column.isActions &&
			!column.isHoverSlot
		) {
			result.push(column.field as keyof T);
		}
	}
	return result;
}

/** Оставляет только значения, присутствующие в актуальном наборе полей. */
export function intersectFields<T>(
	stored: (keyof T)[],
	fields: (keyof T)[],
): (keyof T)[] {
	if (!stored.length) {
		return [];
	}
	const fieldSet = new Set(fields);
	return stored.filter((field) => fieldSet.has(field));
}

/** Сохраняет порядок из storage и добавляет новые поля в конец. */
export function mergeColumnOrder<T>(
	stored: (keyof T)[],
	fields: (keyof T)[],
): (keyof T)[] {
	const ordered = intersectFields(stored, fields);
	for (const field of fields) {
		if (!ordered.includes(field)) {
			ordered.push(field);
		}
	}
	return ordered;
}

/** Удаляет из storage ширины и прочие per-field ключи для удалённых колонок. */
export function purgeRemovedColumnStorage(
	storage: { removeItem(key: string): void },
	removedFields: (string | number | symbol)[],
): void {
	for (const field of removedFields) {
		storage.removeItem(`columns.${String(field)}.width`);
	}
}

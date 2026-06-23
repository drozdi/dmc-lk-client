import type { ColumnEntity } from '../type';

/** Поля колонок, участвующие в порядке / скрытии / ширине / сортировке. */
export function getColumnFields<T>(columns: ColumnEntity<T>[]): (keyof T)[] {
	return columns
		.filter((column) => column.field && column.isField && !column.isSelecting)
		.map((column) => column.field as keyof T);
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

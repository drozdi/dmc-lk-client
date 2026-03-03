/**
 * Функция cached создает кэширующую обертку для переданной функции.
 * @param {Function} fn - Функция, которую нужно кэшировать.
 * @returns {Function} - Кэширующая обертка для переданной функции.
 */
export function cached<T>(fn: Function) {
	const cache = Object.create(null)
	return function cachedFn(...args: any[]): T {
		const hit = cache[args.join('-')]
		return hit || (cache[args.join('-')] = fn(...args))
	}
}

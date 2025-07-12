function isArray(value) {
	if (Array.isArray) {
		return Array.isArray(value)
	} else {
		return Object.prototype.toString.call(value) === '[object Array]'
	}
}
function isBoolean(value) {
	return typeof value === 'boolean'
}
function isObject(value) {
	return value !== null && typeof value === 'object' && !!value
}
function isSymbol(value) {
	if (typeof Symbol === 'function') {
		return typeof value === 'symbol'
	} else {
		return Object.prototype.toString.call(value) === '[object Symbol]'
	}
}

function last(array) {
	const length = array == null ? 0 : array.length
	return length ? array[length - 1] : undefined
}
function isKey(value, object) {
	if (isArray(value)) {
		return false
	}
	const type = typeof value
	if (
		type === 'number' ||
		type === 'boolean' ||
		value == null ||
		isSymbol(value)
	) {
		return true
	}
	return object != null && value in Object(object)
}
function toKey(value) {
	if (typeof value === 'string' || isSymbol(value)) {
		return value
	}
	return `${value}`
}
function parent(object, path) {
	return path.length < 2 ? object : get(object, path.slice(0, -1))
}
function castPath(value, object) {
	if (isArray(value)) {
		return value
	}
	return isKey(value, object) ? [value] : value.split('.')
}
export function get(object, path) {
	path = castPath(path, object)

	let index = 0
	const length = path.length

	while (object != null && index < length) {
		object = object[toKey(path[index++])]
	}
	return index && index === length ? object : undefined
}
export function set(object, path, value) {
	if (!isObject(object)) {
		return object
	}
	path = castPath(path, object)

	const length = path.length
	const lastIndex = length - 1

	let index = -1
	let nested = object

	while (nested != null && ++index < lastIndex) {
		const key = toKey(path[index])
		nested[key] = nested[key] || {}
		nested = nested[key]
	}

	nested[toKey(last(path))] = value

	return object
}
export function unset(object, path) {
	path = castPath(path, object)
	object = parent(object, path)
	return object == null || delete object[toKey(last(path))]
}

export function merge(target, ...sources) {
	let deep = sources.pop()
	if (!isBoolean(deep)) {
		sources.push(deep)
		deep = false
	}
	if (!sources.length) {
		return target
	}
	if (deep === false) {
		return Object.assign(target, ...sources)
	}
	const source = sources.shift()
	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) {
					Object.assign(target, {
						[key]: {},
					})
				}
				merge(target[key], source[key], deep)
			} else {
				Object.assign(target, {
					[key]: source[key],
				})
			}
		}
	}
	return merge(target, ...sources, deep)
}

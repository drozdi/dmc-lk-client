import {
	cloneElement,
	createContext,
	createElement,
	Fragment,
	useContext,
	useMemo,
} from 'react'
import { cls } from '../utils/'

/**
 * Контекст с типами по умолчанию
 * @type {React.Context}
 */
const RenderContext = createContext({
	render: ({ as, to }: { as?: React.ReactElement; to?: string }) =>
		!!to ? 'a' : as,
})

/**
 * Компонент RenderProvider
 * @param {object} props - свойства
 * @param {React.ReactNode} props.children - дочерние элементы
 * @param {object} props.contextValues - значения контекста
 * @returns {React.ReactElement} элемент RenderProvider
 */
export function RenderProvider({
	children,
	...contextValues
}: {
	children: React.ReactNode
	contextValues?: {}
}) {
	return (
		<RenderContext.Provider value={contextValues}>
			{children}
		</RenderContext.Provider>
	)
}

/**
 * Хук useRenderContext возвращает контекст рендера.
 * @returns {Object} - Контекст рендера.
 */
export function useRenderContext() {
	return useContext(RenderContext)
}

/**
 * Функция applyContextToProps применяет контекст к свойствам компонента.
 * @param {Object} props - Свойства компонента.
 * @returns {Object} - Объект с объединенными свойствами контекста и компонента.
 */
function applyContextToProps(props?: Record<string, any>) {
	const { render = ({ as }) => as, ...contextValues } = useRenderContext()
	return { ...contextValues, ...props, as: render(props), render: undefined }
}

/**
 * Функция render создает элемент с заданными свойствами и состоянием.
 * @param {string|Function} tag - Тег или функция для создания элемента.
 * @param {Object} props - Свойства элемента.
 * @param {Object} state - Состояние элемента.
 * @returns {React.ReactElement} - Элемент с заданными свойствами и состоянием.
 */
export function render(
	tag?: string | Function,
	props?: Record<string, any>,
	state?: Record<string, any>
) {
	let {
		as: Component = tag,
		children,
		if: _if,
		...rest
	}: {
		as?: string | Function | any
		children?: React.ReactNode
		if?: (state?: Record<string, any>) => boolean
		[key: string]: any
	} = applyContextToProps(props)
	// Условный рендеринг
	if (_if?.(state) === false) {
		return null
	}

	// Если компонент не указан, возвращаем null
	if (!Component) {
		return null
	}

	const memoizedRest = useMemo(() => {
		const result = { ...rest }
		for (const key of ['className', 'style']) {
			if (key in rest && rest[key] && typeof rest[key] === 'function') {
				if (Component.render) {
					result[key] = arg => rest[key]({ ...arg, ...state }, rest)
				} else {
					result[key] = rest[key]?.(state || {}, rest)
				}
			}
		}

		if (result['aria-labelledby'] && result['aria-labelledby'] === result.id) {
			result['aria-labelledby'] = undefined
		}

		return result
	}, [Component, rest, state])

	let resolvedChildren =
		typeof children === 'function' ? children(state) : children

	if (Component === Fragment) {
		let childProps = resolvedChildren?.props ?? {}
		let childPropsClassName = childProps?.className
		let childPropsStyle = childProps?.style

		let newClassName = cls(
			typeof childPropsClassName === 'function'
				? childPropsClassName(state, memoizedRest.className)
				: childPropsClassName,
			memoizedRest.className
		)

		let newStyle = {
			...(typeof childPropsStyle === 'function'
				? childPropsStyle(state, memoizedRest.style)
				: childPropsStyle),
			...memoizedRest.style,
		}

		return cloneElement(resolvedChildren, {
			...memoizedRest,
			className: newClassName,
			style: newStyle,
		})
	}

	return createElement(Component, memoizedRest, resolvedChildren)
}

render.displayName = 'internal/render'

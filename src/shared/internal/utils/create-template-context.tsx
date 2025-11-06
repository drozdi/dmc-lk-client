import { cloneElement, createContext, isValidElement, useContext, useEffect, useId, useMemo, useState } from 'react'

type TemplateStateValue = Record<string, any>
type TemplateContextValue = {
	templates: TemplateStateValue
	register: (slotName: string, element: any) => void
	unregister: (slotName: string) => void
}
interface TemplateProviderProps {
	children: React.ReactNode
	value?: TemplateContextValue
}
interface TemplateProps {
	slot: string
	children?: React.ReactNode
	[key: string]: any
}
interface TemplateSlotProps extends React.HTMLAttributes<HTMLElement> {
	name: string
	children?: React.ReactNode
}

export function createTemplateContext() {
	// Создаем контекст для менеджера шаблонов
	const TemplateContext = createContext<TemplateStateValue | null>(null)

	/**
	 * Хук для доступа к менеджеру шаблонов
	 * @returns {Object} API менеджера шаблонов
	 */
	function useTemplateManager() {
		const context = useContext(TemplateContext)

		if (!context) {
			throw new Error('useTemplateManager должен использоваться внутри Template.Provider')
		}

		return {
			getTemplates: (slotName: string) => context.templates[slotName],
			hasTemplate: (slotName: string) => !!context.templates[slotName],
		}
	}

	// Фабрика контекста для создания нового контекста
	function factoryContext(): TemplateContextValue {
		const [templates, setTemplates] = useState<TemplateStateValue>({})

		const actions = useMemo<Omit<TemplateContextValue, 'templates'>>(
			() => ({
				register: (slotName: string, element: React.ReactNode) => {
					setTemplates((prev: TemplateStateValue): TemplateStateValue => ({ ...prev, [slotName]: element }))
				},
				unregister: (slotName: string) => {
					setTemplates((prev: TemplateStateValue): TemplateStateValue => {
						const { [slotName]: _, ...rest } = prev
						return rest
					})
				},
			}),
			[]
		)

		return useMemo<TemplateContextValue>(
			() => ({
				templates,
				...actions,
			}),
			[templates]
		)
	}

	function Template({ slot = 'default', children, ...props }: TemplateProps) {
		const manager = useContext(TemplateContext)
		const uniqueId = useId()

		const element = useMemo(
			() => (isValidElement(children) ? cloneElement(children, { key: uniqueId, ...props }) : children),
			[children, uniqueId, props]
		)

		useEffect(() => {
			if (!manager) {
				return
			}

			manager.register(slot, element)

			return () => {
				manager.unregister(slot)
			}
		}, [slot, element])

		if (!manager) {
			return typeof children === 'function' ? (children as Function)(props) : children
		}

		return null
	}

	/**
	 * Провайдер для управления шаблонами
	 * @param {Object} props - Свойства компонента
	 * @param {React.ReactNode} props.children - Дочерние элементы
	 */
	Template.Provider = ({ children, value }: TemplateProviderProps) => {
		const contextValue = value || factoryContext()
		return <TemplateContext.Provider value={contextValue}>{children}</TemplateContext.Provider>
	}

	/**
	 * Компонент слота для размещения шаблонов
	 *
	 * @param {Object} props - Свойства компонента
	 * @param {string} props.name['default'] - Имя слота
	 * @param {string} props.children - Дочерние элементы
	 */
	Template.Slot = ({ name = 'default', children, ...slotProps }: TemplateSlotProps) => {
		const manager = useContext(TemplateContext)

		// Если нет менеджера, используем children как fallback
		if (!manager) {
			console.warn('Template.Slot используется вне Template.Provider')
			return children || null
		}

		const template = manager.templates[name] || children

		// Если шаблона не валиден
		if (!isValidElement(template)) {
			return <>{template}</>
		}
		if (typeof template === 'function') {
			// Для функциональных шаблонов передаем параметры
			return (template as Function)(slotProps)
		}

		// Для статических элементов клонируем с props
		return cloneElement(template, { ...slotProps, key: template.key })
	}

	/**
	 * Компонент для проверки слота
	 *
	 * @param {Object} props - Свойства компонента
	 * @param {string} props.name['default'] - Имя слота
	 * @param {string} props.children - Дочерние элементы
	 */
	Template.Has = ({ name, children }: { name: string; children: React.ReactNode }) => {
		const { hasTemplate } = useTemplateManager()
		return hasTemplate(name) ? children : null
	}

	Template.Context = TemplateContext

	return [Template, useTemplateManager]
}

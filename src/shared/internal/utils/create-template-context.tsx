import {
	cloneElement,
	createContext,
	Fragment,
	useContext,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from 'react'

type TemplateManagerStateType = Record<
	string,
	Array<{
		id: number
		element: React.ReactNode
	}>
>
type TemplateManagerContextType = {
	templates: TemplateManagerStateType
	registerTemplate: (slotName: string, element: React.ReactNode) => number
	unregisterTemplate: (slotName: string, id: number) => void
}

export function createTemplateContext() {
	// Создаем контекст для менеджера шаблонов
	const TemplateManagerContext =
		createContext<TemplateManagerContextType | null>(null)

	/**
	 * Провайдер для управления шаблонами
	 * @param {Object} props - Свойства компонента
	 * @param {React.ReactNode} props.children - Дочерние элементы
	 */
	function TemplateProvider({ children }: { children: React.ReactNode }) {
		// Состояние для хранения шаблонов: { [slotName]: [elements] }
		const [templates, setTemplates] = useState<TemplateManagerStateType>({})

		// Счетчик для генерации уникальных ключей
		const counterRef = useRef(0)

		// Регистрация шаблона
		const registerTemplate = (slotName: string, element: any): number => {
			const id = ++counterRef.current

			setTemplates(prev => ({
				...prev,
				[slotName]: [...(prev[slotName] || []), { id, element }],
			}))

			return id
		}

		// Удаление шаблона
		const unregisterTemplate = (slotName: string, id: number) => {
			setTemplates(
				(prev: TemplateManagerStateType): TemplateManagerStateType => {
					const slotTemplates = prev[slotName]?.filter(t => t.id !== id) || []
					return {
						...prev,
						[slotName]: slotTemplates.length ? slotTemplates : undefined,
					} as TemplateManagerStateType
				}
			)
		}

		// Значение контекста
		const contextValue = useMemo<TemplateManagerContextType>(
			() => ({
				templates,
				registerTemplate,
				unregisterTemplate,
			}),
			[templates]
		)

		return (
			<TemplateManagerContext.Provider value={contextValue}>
				{children}
			</TemplateManagerContext.Provider>
		)
	}

	function Template({
		slot,
		children,
	}: {
		slot: string
		children: React.ReactNode
	}) {
		const manager = useContext(TemplateManagerContext)
		const [isRegistered, setIsRegistered] = useState(false)
		const templateId = useRef<number | null>(null)
		const uniqueId = useId()

		useEffect(() => {
			if (manager && !isRegistered) {
				// Регистрируем шаблон в менеджере
				templateId.current = manager.registerTemplate(
					slot,
					cloneElement(children, { key: uniqueId })
				)
				setIsRegistered(true)
			}

			return () => {
				if (manager && isRegistered) {
					manager.unregisterTemplate(slot, templateId.current)
				}
			}
		}, [manager, slot, children, isRegistered, uniqueId])

		// Отображаем на месте, если не в контексте или не зарегистрирован
		if (!manager || !isRegistered) {
			return children
		}

		return null
	}

	/**
	 * Компонент слота для размещения шаблонов
	 * @param {Object} props - Свойства компонента
	 * @param {string} props.name - Имя слота
	 * @param {string} props.children - Дочерние элементы
	 */
	function TemplateSlot({
		name,
		children,
		...props
	}: {
		name: string
		children?: any
	}) {
		const manager = useContext(TemplateManagerContext)

		if (!manager) {
			console.warn('TemplateSlot используется вне TemplateProvider')
			return null
		}

		const slotTemplates = manager.templates[name] || []

		return (
			<>
				{slotTemplates.length
					? slotTemplates.map(({ id, element }) => (
							<Fragment key={id}>{cloneElement(element, props)}</Fragment>
					  ))
					: children
					? cloneElement(children, props)
					: null}
			</>
		)
	}

	/**
	 * Хук для доступа к менеджеру шаблонов
	 * @returns {Object} API менеджера шаблонов
	 */
	function useTemplateManager() {
		const context = useContext(TemplateManagerContext)

		if (!context) {
			throw new Error(
				'useTemplateManager должен использоваться внутри TemplateProvider'
			)
		}

		return {
			getTemplates: (slotName: string) => context.templates[slotName] || [],
			isTemplates: (slotName: string) =>
				context.templates[slotName]?.length || [].length,
		}
	}
	return [TemplateProvider, Template, TemplateSlot, useTemplateManager]
}

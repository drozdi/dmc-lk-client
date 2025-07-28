import { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { scopedKeydownHandler } from '../../internal/events/scoped-keydown-handler'
import { cls } from '../../utils'
import { DmcAccordionProvider } from './DmcAccordionContext'
import { DmcAccordionHeader } from './DmcAccordionHeader'
import { DmcAccordionPanel } from './DmcAccordionPanel'
import { DmcAccordionTab } from './DmcAccordionTab'

interface AccordionTabProps {
	id?: string
	className?: string
	children?: React.ReactNode
	value: string
	multiple?: boolean
	border?: boolean
	filled?: boolean
	square?: boolean
	separated?: boolean
	name?: string | string[]
	onChange: (event: React.ChangeEvent, value: string) => void
}

/**
 * Компонент DmcAccordion
 * @param {Object} props - свойства
 * @param {string} props.id - уникальный идентификатор
 * @param {React.ReactNode} props.children - дочерние элементы
 * @param {string} props.className - классы
 * @param {boolean} props.multiple - флаг, указывающий на то, может ли быть выбрано несколько элементов
 * @param {boolean} props.border - флаг, указывающий на то, есть ли граница
 * @param {boolean} props.filled - флаг, указывающий на то, заполнен ли компонент
 * @param {boolean} props.square - флаг, указывающий на то, имеет ли компонент квадратную форму
 * @param {boolean} props.separated - флаг, указывающий на то, разделены ли элементы
 * @param {Function} props.onChange - функция, которая будет вызвана при изменении состояния
 * @param {number|string|array} props.value - значение компонента
 * @param {string} props.name - имя компонента
 * @returns {React.ReactElement} элемент DmcAccordion
 */
export function DmcAccordion({
	id,
	children,
	className,
	multiple,
	border,
	filled,
	square,
	separated,
	onChange,
	value: propsValue,
	name,
	...props
}: AccordionTabProps) {
	const uid = uuid(id)
	const [current, setCurrent] = useState<string | string[] | undefined>(
		multiple ? [].concat(propsValue) : propsValue ?? undefined
	)

	const handleChange = useCallback(
		(event, value) => {
			onChange?.({
				...event,
				value,
				target: {
					...event.target,
					name: name,
					id: uid,
					value,
				},
				stopPropagation: () => {
					event.stopPropagation?.()
				},
				preventDefault: () => {
					event.preventDefault?.()
				},
			})
			setCurrent(() => value)
		},
		[name, onChange, uid]
	)

	const context = useMemo(() => {
		return {
			value: current,
			isActive: (value: string) => {
				if (multiple && Array.isArray(current)) {
					return current.includes(value)
				}
				return current === value
			},
			getHeaderId: (value: string) => {
				return `${uid}-header-${value}`
			},
			getPanelId: (value: string) => {
				return `${uid}-panel-${value}`
			},
			getTabId: (value: string) => {
				return `${uid}-tab-${value}`
			},
			onChange: (event: React.ChangeEvent, value: string) => {
				let newValue: string | string[] | undefined
				if (multiple) {
					newValue = [].concat(current)
					if (!newValue.includes(value)) {
						newValue.push(value)
					} else {
						newValue = newValue.filter(v => v !== value)
					}
				} else {
					newValue = current === value ? undefined : value
				}

				handleChange(event, newValue)
			},
			onKeyDown: scopedKeydownHandler({
				parentSelector: '.dmc-accordion',
				siblingSelector: 'button, [role="button"]',
				loop: true,
				activateOnFocus: !multiple,
				orientation: 'xy',
			}),
		}
	}, [uid, current, multiple, handleChange])

	useLayoutEffect(() => {
		let newValue
		if (Array.isArray(current) && !multiple) {
			newValue = current[0] ?? undefined
		} else if (!Array.isArray(current) && multiple) {
			newValue = current ? [current] : []
		} else {
			newValue = multiple ? [] : undefined
		}
		handleChange({}, newValue)
	}, [multiple])

	useLayoutEffect(() => {
		setCurrent(() =>
			multiple ? [].concat(propsValue) : propsValue ?? undefined
		)
	}, [multiple, propsValue])

	return (
		<div
			{...props}
			id={uid}
			className={cls('dmc-accordion', className, {
				'dmc-accordion--border': border,
				'dmc-accordion--filled': filled,
				'dmc-accordion--square': square,
				'dmc-accordion--separated': separated,
			})}
		>
			<DmcAccordionProvider value={context}>{children}</DmcAccordionProvider>
		</div>
	)
}

DmcAccordion.Tab = DmcAccordionTab
DmcAccordion.Header = DmcAccordionHeader
DmcAccordion.Panel = DmcAccordionPanel

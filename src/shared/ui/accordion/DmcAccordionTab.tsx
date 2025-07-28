import { useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { cls } from '../../utils'
import { useDmcAccordionContext } from './DmcAccordionContext'
import { DmcAccordionTabProvider } from './DmcAccordionTabContext'
import './style.css'

interface AccordionTabProps {
	id?: string
	active?: boolean
	className?: string
	children?: React.ReactNode
	disabled?: boolean
	value: string
}

/**
 * Компонент XAccordionTab представляет собой вкладку аккордеона.
 *
 * @param {Object} props - Свойства компонента.
 * @param {string} [props.id] - Уникальный идентификатор вкладки.
 * @param {boolean} [props.active] - Флаг, указывающий, активна ли вкладка.
 * @param {string} [props.className] - Дополнительные CSS-классы для вкладки.
 * @param {ReactNode} props.children - Дочерние элементы вкладки.
 * @param {boolean} [props.disabled] - Флаг, указывающий, отключена ли вкладка.
 * @param {string} props.value - Значение вкладки.
 * @returns {ReactElement} Элемент React, представляющий вкладку аккордеона.
 */
export function DmcAccordionTab({
	id,
	active,
	className,
	children,
	disabled,
	value,
	...props
}: AccordionTabProps) {
	const ctx = useDmcAccordionContext()
	const isActive = ctx?.isActive(value)
	const [expanded, setExpanded] = useState(isActive ?? active)
	const uid = uuid(id ?? ctx?.getTabId(value))

	const context = useMemo(() => {
		return {
			value,
			disabled,
			active: isActive ?? expanded,
			getPanelId: () => ctx?.getPanelId(value) ?? `${uid}-panel`,
			getHeaderId: () => ctx?.getHeaderId(value) ?? `${uid}-header`,
			onKeyDown: ctx?.onKeyDown,
			onToggleExpanded: event => {
				if (disabled) {
					return
				}
				ctx?.onChange?.(event, value)
				ctx || setExpanded(v => !v)
			},
		}
	}, [value, disabled, isActive, expanded, uid, ctx])

	return (
		<div
			{...props}
			id={uid}
			className={cls(
				'dmc-accordion-tab',
				{
					'dmc-accordion-tab--expanded': isActive ?? expanded,
					'dmc-accordion-tab--disabled': disabled,
				},
				className
			)}
		>
			<DmcAccordionTabProvider value={context}>
				{children}
			</DmcAccordionTabProvider>
		</div>
	)
}

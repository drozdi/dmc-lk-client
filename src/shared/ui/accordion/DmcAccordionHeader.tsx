import { Sections } from '../../internal/sections'
import { cls } from '../../utils'
import { DmcChevron } from '../icon'
import { useDmcAccordionTabContext } from './DmcAccordionTabContext'
import './style.css'

interface AccordionHeaderProps {
	children?: React.ReactNode
	className?: string
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
	leftSection?: React.ReactNode
	rightSection?: React.ReactNode
}

/**
 * Компонент XAccordionHeader
 * @param {Object} props - свойства
 * @param {React.ReactNode} props.children - дочерние элементы
 * @param {string} props.className - классы
 * @param {Function} props.onClick - функция, которая будет вызвана при клике
 * @param {React.ReactNode} props.leftSection - левый раздел
 * @param {React.ReactNode} props.rightSection - правый раздел
 * @returns {React.ReactElement} элемент XAccordionHeader
 */
export function DmcAccordionHeader({
	className,
	children,
	onClick,
	...props
}: AccordionHeaderProps) {
	const {
		value,
		active,
		disabled,
		getHeaderId,
		getPanelId,
		onKeyDown,
		onToggleExpanded,
	} = useDmcAccordionTabContext()

	const handleClick = event => {
		if (disabled) {
			return
		}
		event.value = value
		onClick?.(event)
		onToggleExpanded?.(event)
	}
	const handleKeyDown = event => {
		event.value = value
		onKeyDown?.(event)
	}

	return (
		<Sections
			as='button'
			rightSection={<DmcChevron className='dmc-accordion-chevron' />}
			{...props}
			id={getHeaderId(value)}
			className={cls('dmc-accordion-header', className)}
			role='button'
			disabled={disabled}
			aria-disabled={disabled}
			aria-expanded={active}
			aria-controls={getPanelId(value)}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
		>
			{children}
		</Sections>
	)
}

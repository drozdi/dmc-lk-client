import { cls } from '../../utils'
import { useDmcAccordionTabContext } from './DmcAccordionTabContext'
import './style.css'

interface AccordionPanelProps {
	className?: string
	children?: React.ReactNode
}
/**
 * Компонент XAccordionPanel
 * @param {Object} props - свойства
 * @param {React.ReactNode} props.children - дочерние элементы
 * @param {string} props.className - классы
 * @returns {React.ReactElement} элемент XAccordionPanel
 */
export function DmcAccordionPanel({
	className,
	children,
	...props
}: AccordionPanelProps) {
	const { getPanelId, getHeaderId } = useDmcAccordionTabContext()
	return (
		<div
			{...props}
			id={getPanelId()}
			role='region'
			aria-labelledby={getHeaderId()}
			className='dmc-accordion-panel'
		>
			<div className={cls('dmc-accordion-content', className)}>{children}</div>
		</div>
	)
}

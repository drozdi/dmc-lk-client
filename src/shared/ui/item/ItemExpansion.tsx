import { memo } from 'react'
import { TbChevronDown } from 'react-icons/tb'
import { useDisclosure } from '../../hooks/use-disclosure'
import { cls } from '../../utils'
import { Collapse } from '../collapse'
import { Icon } from '../icon'
import { Item } from './Item'
import { ItemLabel } from './ItemLabel'
import { ItemSection } from './ItemSection'
import './style.css'

interface ItemExpansionProps {
	children?: React.ReactNode
	className?: string
	dense?: boolean
	color?: string
	active?: boolean
	disabled?: boolean
	vertical?: boolean
	hoverable?: boolean
	activeClass?: string
	tabIndex?: number
	role?: string
	onClick?: (event: React.MouseEvent) => void
	icon?: React.ReactNode
	label?: string
	caption?: string
	opened?: boolean
	[key: string]: any
}

export const ItemExpansion = memo(
	({
		className,
		children,
		tabIndex = 0,
		vertical,
		dense,
		active,
		activeClass,
		disabled,
		role,
		onClick,
		hoverable,
		color,
		icon,
		label,
		caption,
		opened: _opened,
		...props
	}: ItemExpansionProps) => {
		const [opened, { toggle }] = useDisclosure(Boolean(_opened))

		const handleClick = (event: React.MouseEvent): void => {
			event.preventDefault()
			if (disabled) {
				return
			}
			onClick?.(event)
			toggle?.()
		}

		return (
			<>
				<Item
					className={cls({
						'mdc-item--opened': opened,
					})}
					role='button'
					onClick={handleClick}
				>
					{icon && (
						<ItemSection side>
							<Icon>{icon}</Icon>
						</ItemSection>
					)}
					<ItemSection>
						{label && <ItemLabel>{label}</ItemLabel>}
						{caption && <ItemLabel caption>{caption}</ItemLabel>}
					</ItemSection>
					<ItemSection side>
						<TbChevronDown className='mdc-item__chevron' />
					</ItemSection>
				</Item>
				<Collapse className='mdc-list-items' active={opened}>
					{children}
				</Collapse>
			</>
		)
	}
)

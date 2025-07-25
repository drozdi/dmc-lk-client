import { memo } from 'react'
import { TbChevronDown } from 'react-icons/tb'
import { useDisclosure } from '../../hooks/use-disclosure'
import { cls } from '../../utils'
import { DmcCollapse } from '../collapse'
import { DmcItem } from './DmcItem'
import { DmcItemLabel } from './DmcItemLabel'
import { DmcItemSection } from './DmcItemSection'
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

export const DmcItemExpansion = memo(
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
				<DmcItem
					{...props}
					className={cls({
						'dmc-item--opened': opened,
					})}
					role='button'
					onClick={handleClick}
				>
					{icon && (
						<DmcItemSection side>
							<DmcIcon>{icon}</DmcIcon>
						</DmcItemSection>
					)}
					<DmcItemSection>
						{label && <DmcItemLabel>{label}</DmcItemLabel>}
						{caption && <DmcItemLabel caption>{caption}</DmcItemLabel>}
					</DmcItemSection>
					<DmcItemSection side>
						<TbChevronDown className='dmc-item__chevron' />
					</DmcItemSection>
				</DmcItem>
				<DmcCollapse className='dmc-list-items' active={opened}>
					{children}
				</DmcCollapse>
			</>
		)
	}
)

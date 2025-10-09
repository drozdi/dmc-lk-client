import { memo } from 'react'
import { useDisclosure } from '../../hooks/use-disclosure'
import { DmcCollapse } from '../collapse'
import { Icon } from '../icon'
import { DmcItem } from './DmcItem'
import { DmcItemLabel } from './DmcItemLabel'
import { DmcItemSection } from './DmcItemSection'
import classes from './style.module.css'

interface ItemExpansionProps {
	children?: React.ReactNode
	className?: string
	dense?: boolean
	color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'info' | 'danger' | 'dark'
	active?: boolean
	disabled?: boolean
	vertical?: boolean
	activeClass?: string
	tabIndex?: number
	role?: string
	onClick?: (event: React.MouseEvent) => void
	leftSection?: React.ReactNode
	rightSection?: React.ReactNode
	label?: string
	caption?: string
	opened?: boolean
	keepMounted?: boolean
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
		leftSection,
		rightSection,
		label,
		caption,
		opened: _opened,
		keepMounted,
		...props
	}: ItemExpansionProps) => {
		classes
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
				<DmcItem {...props} className={opened ? classes.item_opened : ''} role='button' onClick={handleClick}>
					{leftSection && <DmcItemSection side>{leftSection}</DmcItemSection>}
					<DmcItemSection>
						{label && <DmcItemLabel>{label}</DmcItemLabel>}
						{caption && <DmcItemLabel caption>{caption}</DmcItemLabel>}
					</DmcItemSection>
					{rightSection && <DmcItemSection side>{rightSection}</DmcItemSection>}
					<DmcItemSection side>
						<Icon className={classes.chevron}>tb-chevron-down</Icon>
					</DmcItemSection>
				</DmcItem>
				<DmcCollapse className='dmc-list-items' active={opened}>
					{(keepMounted || opened) && children}
				</DmcCollapse>
			</>
		)
	}
)

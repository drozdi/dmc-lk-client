import { memo } from 'react'
import { cls } from '../../utils'
import './style.css'

const roleAttrExceptions = ['ul', 'ol']

interface ListProps {
	as?: 'ul' | 'ol'
	children?: React.ReactNode
	className?: string
	separator?: boolean
	visible?: boolean
	dense?: boolean
	bordered?: boolean
	role?: string
	style?: React.CSSProperties
	onClick?: () => void
	onKeyDown?: () => void
	onKeyUp?: () => void
	onKeyPress?: () => void
}

export const List = memo(
	({
		as = 'ul',
		children,
		className,
		separator,
		dense,
		visible,
		bordered,
		role,
		...props
	}: ListProps) => {
		const Tag = as
		const attrRole = roleAttrExceptions.includes(as)
			? undefined
			: role ?? 'list'
		return (
			<Tag
				{...props}
				className={cls(
					'mdc-list',
					{
						'mdc-list--dense': dense,
						'mdc-list--visible': visible,
						'mdc-list--separator': separator,
						'mdc-list--bordered': bordered,
					},
					className
				)}
				role={attrRole}
			>
				{children}
			</Tag>
		)
	}
)

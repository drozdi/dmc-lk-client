import { forwardRef, memo } from 'react'
import { render } from '../../internal/render'
import { cls } from '../../utils'
import './style.css'

const roleAttrExceptions = ['ul', 'ol']

interface ListProps {
	as?: string
	children?: React.ReactNode
	className?: string
	separator?: boolean
	visible?: boolean
	dense?: boolean
	bordered?: boolean
	striped?: boolean
	role?: string
	style?: React.CSSProperties
	onClick?: () => void
	onKeyDown?: () => void
	onKeyUp?: () => void
	onKeyPress?: () => void
}

export const DmcList = memo(
	forwardRef(
		(
			{
				children,
				className,
				separator,
				dense,
				visible,
				bordered,
				striped,
				role,
				...props
			}: ListProps,
			ref
		) => {
			const attrRole = roleAttrExceptions.includes(props.as)
				? undefined
				: role ?? 'list'
			return render('ul', {
				...props,
				ref,
				className: cls(
					'dmc-list',
					{
						'dmc-list--dense': dense,
						'dmc-list--visible': visible,
						'dmc-list--separator': separator,
						'dmc-list--bordered': bordered,
						'dmc-list--striped': striped,
					},
					className
				),
				role: attrRole,
				children,
			})
		}
	)
)

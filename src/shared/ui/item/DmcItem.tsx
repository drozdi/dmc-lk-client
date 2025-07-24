import { forwardRef, memo, useMemo, useRef } from 'react'
import { useForkRef } from '../../hooks'
import { render } from '../../internal/render'
import { cls } from '../../utils'
import './style.css'

const clickableTag = ['a', 'label', 'button']
const disRoleTag = ['label']
const disDisabledTag = ['div', 'span', 'a', 'label']

interface ItemProps {
	as?: 'li'
	children: React.ReactNode
	className?: string
	role?: string
	tabIndex?: number
	vertical?: boolean
	dense?: boolean
	active?: boolean
	activeClass?: string
	disabled?: boolean
	hoverable?: boolean
	bordered?: boolean
	color?: 'primary' | 'secondary'
	onClick?: (e: React.MouseEvent<HTMLElement>) => void
	onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void
	onKeyUp?: (e: React.KeyboardEvent<HTMLElement>) => void
	onKeyPress?: (e: React.KeyboardEvent<HTMLElement>) => void
	onFocus?: (e: React.FocusEvent<HTMLElement>) => void
	onBlur?: (e: React.FocusEvent<HTMLElement>) => void
	[key: string]: any
}

export const DmcItem = memo(
	forwardRef(
		(
			{
				className,
				children,
				tabIndex = 0,
				vertical,
				dense,
				active,
				activeClass,
				disabled,
				bordered,
				role,
				onClick,
				hoverable,
				...props
			}: ItemProps,
			ref
		) => {
			const elementRef = useRef()
			const handleRef = useForkRef(ref, elementRef)
			const isActionable = useMemo(() => {
				return (
					clickableTag.includes(
						elementRef.current?.nodeName.toLowerCase() ?? props.as
					) || typeof onClick === 'function'
				)
			}, [props.as, elementRef.current, onClick])

			const isClickable = !disabled && isActionable
			const isHoverable = isClickable || hoverable

			const attrs = useMemo(() => {
				const attrs: Record<string, any> = {
					className: cls(
						'dmc-item',
						{
							'dmc-item--dense': dense,
							'dmc-item--active': active,
							'dmc-item--disabled': disabled,
							'dmc-item--clickable': isClickable,
							'dmc-item--hoverable': isHoverable,
							'dmc-item--vertical': vertical,
							'dmc-item--bordered': bordered,
						},
						className
					),
					role: disRoleTag.includes(props.as) ? undefined : role ?? 'listitem',
					disabled: disabled,
				}
				if (isActionable) {
					attrs['aria-disabled'] = disabled
				}
				if (isClickable) {
					attrs.tabIndex = disabled ? -1 : tabIndex ?? -1
				}
				if (disDisabledTag.includes(props.as)) {
					delete attrs.disabled
				}
				return attrs
			}, [
				disabled,
				tabIndex,
				role,
				dense,
				active,
				className,
				activeClass,
				isHoverable,
				isClickable,
				isActionable,
			])

			return render(
				'li',
				{
					...props,
					...attrs,
					ref: handleRef,
					onClick: (event: React.MouseEvent<HTMLElement>) => {
						if (disabled) {
							event.preventDefault()
						}
						onClick?.(event)
					},
					children,
				},
				{ active, disabled }
			)
		}
	)
)

import { createElement as h } from 'react'
import { cls } from '../../utils'

interface IconProps {
	children?: string
	className?: string
	name?: string
	color?: string
	as?: string
	[key: string]: any
}
export function Icon({
	children,
	className,
	color,
	as = 'i',
	...props
}: IconProps) {
	if (!children) {
		return ''
	}
	color &&= color = ' text-' + color
	color ||= ''

	return h(
		as,
		{
			...props,
			className: cls('mdc-icon', color, className),
			role: 'presentation',
			'aria-hidden': 'true',
		},
		children
	)
}

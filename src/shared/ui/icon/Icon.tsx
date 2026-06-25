import { createElement as h, memo } from 'react'
import * as MdIcons from 'react-icons/md'
import { camelize, capitalize, cls } from '../../utils'

interface IconProps {
	children?: string
	className?: string
	name?: string
	color?: string
	as?: string
	size?: number | string
	title?: string
	[key: string]: any
}

const replace = (str: string) => {
	return str.replace('mdi-', 'tb-')
}
const getIcon = (name: string) => {
	return MdIcons?.[capitalize(camelize(name))] || ''
}

function IconRoot({ children, className, color, size, title, as = 'i', ...props }: IconProps) {
	if (!children) {
		return ''
	}
	color &&= color = ' text-' + color
	color ||= ''

	let name = replace(children)

	if (!/^mb-/.test(name)) {
		name = 'md-' + name
	}
	if (name === 'tb-x') {
		name = 'md-close'
	}

	const IconComponent = getIcon(name)
	return h(
		as,
		{
			...props,
			className: cls(color, name.split('-')[0], name, className),
			role: 'presentation',
			'aria-hidden': 'true',
		},
		IconComponent && <IconComponent size={size} title={title} />
	)
}

export const Icon = memo(IconRoot)

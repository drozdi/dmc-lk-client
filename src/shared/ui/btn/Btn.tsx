import { useMemo } from 'react'
import { render } from '../../internal/render'
import { Sections } from '../../internal/sections'
import { cls } from '../../utils'
import { Spinner } from '../spinner'
import './style.css'

interface BtnProps {
	children?: React.ReactNode
	className?: string
	type?: string
	color?:
		| 'primary'
		| 'secondary'
		| 'success'
		| 'warning'
		| 'danger'
		| 'accent'
		| 'info'
		| 'dark'
	size?: 'xs' | 'sm' | 'lg'
	flat?: boolean
	text?: boolean
	tonal?: boolean
	plain?: boolean
	outline?: boolean
	block?: boolean
	square?: boolean
	round?: boolean
	rounded?: boolean
	loading?: boolean
	icon?: boolean
	leftSection?: React.ReactElement
	rightSection?: React.ReactElement
	[key: string]: any
}

export const Btn = ({
	children,
	className,
	color,
	size,
	flat,
	text,
	tonal,
	plain,
	outline,
	block,
	square,
	round,
	rounded,
	loading,
	icon,
	leftSection,
	rightSection,
	...props
}: BtnProps) => {
	const isIcon = useMemo(
		() =>
			icon &&
			((!leftSection != !rightSection && !children) ||
				(!leftSection && !rightSection && children)),
		[children, leftSection, rightSection, icon]
	)
	return render('button', {
		...props,
		className: cls(
			'mdc-btn',
			{
				'mdc-btn--flat': flat,
				'mdc-btn--text': text,
				'mdc-btn--tonal': tonal,
				'mdc-btn--plain': plain,
				'mdc-btn--outline': outline,
				'mdc-btn--block': block,
				'mdc-btn--square': square,
				'mdc-btn--round': round,
				'mdc-btn--rounded': rounded,
				'mdc-btn--loading': loading,
				'mdc-btn--icon': isIcon,
				[`mdc-btn--${color}`]: color,
				[`mdc-btn--${size}`]: size,
			},
			className
		),
		children:
			typeof children === 'function' ? (
				children
			) : (
				<>
					<Sections
						as='span'
						leftSection={leftSection}
						rightSection={rightSection}
						className='mdc-btn-content'
						classBody='mdc-btn-label'
					>
						{children}
					</Sections>

					<span className='mdc-btn-loader'>
						<Spinner size='2em' thickness={5} />
					</span>
				</>
			),
	})
}

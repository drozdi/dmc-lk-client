import { useMemo } from 'react'
import { render } from '../../internal/render'
import { Sections } from '../../internal/sections'
import { cls } from '../../utils'
import { DmcSpinner } from '../spinner'
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
	active?: boolean
	disabled?: boolean
	leftSection?: React.ReactElement
	rightSection?: React.ReactElement
	[key: string]: any
}

export const DmcBtn = ({
	active,
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
			'dmc-btn',
			{
				'ndc-btn--disabled': props.disabled,
				'dmc-btn--active': active,
				'dmc-btn--flat': flat,
				'dmc-btn--text': text,
				'dmc-btn--tonal': tonal,
				'dmc-btn--plain': plain,
				'dmc-btn--outline': outline,
				'dmc-btn--block': block,
				'dmc-btn--square': square,
				'dmc-btn--round': round,
				'dmc-btn--rounded': rounded,
				'dmc-btn--loading': loading,
				'dmc-btn--icon': isIcon,
				[`dmc-btn--${color}`]: color,
				[`dmc-btn--${size}`]: size,
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
						className='dmc-btn-content'
						classBody='dmc-btn-label'
					>
						{children}
					</Sections>

					<span className='dmc-btn-loader'>
						<DmcSpinner size='2em' thickness={5} />
					</span>
				</>
			),
	})
}

import { useMemo } from 'react'
import { render } from '../../internal/render'
import { Sections } from '../../internal/sections'
import { cls } from '../../utils'
import { DmcIcon } from '../icon'
import { DmcSpinner } from '../spinner'
import { DmcBtnGroup, useDmcBtnGroupContext } from './group'

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
	value?: string | number
	rounded?: boolean
	loading?: boolean
	active?: boolean
	disabled?: boolean
	leftSection?: React.ReactElement
	rightSection?: React.ReactElement
	[key: string]: any
}

export const DmcBtn = (_props: BtnProps) => {
	const ctx = useDmcBtnGroupContext()
	const {
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
		leftSection,
		rightSection,
		...props
	} = { ...ctx?.props, ..._props }

	if (ctx) {
		props.onClick = (event, value) => {
			ctx.onChange?.(event, props.value)
			_props.onClick?.(event, value)
		}
		props.active = ctx.isActive?.(props.value) ?? _props.active
		props.disabled = ctx.isDisabled?.(props.value) ?? _props.disabled
	}

	const isIcon = useMemo(
		() =>
			(!leftSection != !rightSection && !children) ||
			(!leftSection && !rightSection && children?.type === DmcIcon),
		[children, leftSection, rightSection]
	)
	return render('button', {
		...props,
		className: cls(
			'dmc-btn',
			{
				'ndc-btn--disabled': props.disabled,
				'dmc-btn--active': props.active,
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

DmcBtn.Group = DmcBtnGroup

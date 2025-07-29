import { memo, useMemo } from 'react'
import { cls } from '../../utils'
import './style.css'

interface ProgressBarProps {
	children?: React.ReactNode
	className?: string
	value?: number
	buffer?: number
	color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger'
	label?: boolean
	stripe?: boolean
	animation?: boolean
	indeterminate?: boolean
	thickness?: number
	reverse?: boolean
	size?: number
}

export function DmcProgressBarRoot({
	children,
	className,
	value,
	buffer,
	color,
	label,
	stripe,
	animation,
	indeterminate,
	thickness,
	reverse,
}: ProgressBarProps) {
	const attrs = useMemo(() => ({
		role: 'progressbar',
		'aria-valuemin': 0,
		'aria-valuemax': 100,
		'aria-valuenow': indeterminate === true ? void 0 : value,
	}))
	const trackAttrs = useMemo(
		() => ({
			style: { width: buffer && !indeterminate ? `${buffer}%` : '' },
		}),
		[buffer, indeterminate]
	)
	const valueAttrs = useMemo(
		() => ({
			style: { width: value && !indeterminate ? `${value}%` : '' },
		}),
		[value, indeterminate]
	)

	return (
		<div
			{...attrs}
			className={cls('dmc-progress-bar', className, {
				'dmc-progress-bar--stripe': !indeterminate && stripe,
				'dmc-progress-bar--animation': !indeterminate && animation,
				'dmc-progress-bar--indeterminate': indeterminate,
				'dmc-progress-bar--reverse': reverse,
				[`text-${color}`]: color,
			})}
			style={{ height: thickness }}
		>
			<div {...trackAttrs} className='dmc-progress-bar__track'></div>
			<div {...valueAttrs} className='dmc-progress-bar__value'></div>
			{!indeterminate && children && (
				<div className='dmc-progress-bar__label'>{children}</div>
			)}
			{!indeterminate && !children && label && (
				<div className='dmc-progress-bar__label'>{value}%</div>
			)}
		</div>
	)
}

export const DmcProgressBar = memo(DmcProgressBarRoot)

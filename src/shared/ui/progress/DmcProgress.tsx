import { memo, useMemo } from 'react'
import { cls } from '../../utils'
import './style.css'

interface ProgressProps {
	children?: React.ReactNode
	className?: string
	type?: 'bar' | 'circle'
	value?: number
	buffer?: number
	color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger'
	label?: boolean
	stripe?: boolean
	animation?: boolean
	indeterminate?: boolean
	size?: number
	thickness?: number
	reverse?: boolean
}

export function DmcProgressRoot({
	children,
	className,
	type = 'bar',
	value,
	buffer,
	color,
	label,
	stripe,
	animation,
	indeterminate,
	size,
	thickness,
	reverse,
}: ProgressProps) {
	const attrs = {
		role: 'progressbar',
		'aria-valuemin': 0,
		'aria-valuemax': 100,
		'aria-valuenow': indeterminate === true ? void 0 : value,
	}
	const normalizedValue = useMemo(
		() => Math.max(0, Math.min(100, parseFloat(value))),
		[value]
	)
	const normalizedBuffer = useMemo(
		() => Math.max(0, Math.min(100, parseFloat(buffer))),
		[buffer]
	)
	const valueAttrs = useMemo(
		() => ({
			style: { width: value && !indeterminate ? `${normalizedValue}%` : '' },
		}),
		[value, indeterminate]
	)
	const trackAttrs = useMemo(
		() => ({
			style: { width: buffer && !indeterminate ? `${normalizedBuffer}%` : '' },
		}),
		[buffer, indeterminate]
	)

	const progressBar = () => (
		<div
			{...attrs}
			className={cls('dmc-progress-bar', className, {
				'dmc-progress-bar--stripe': !indeterminate && stripe,
				'dmc-progress-bar--animation': !indeterminate && animation,
				'dmc-progress-bar--indeterminate': indeterminate,
				'dmc-progress-bar--reverse': reverse,
				[`text-${color}`]: color,
			})}
			style={{
				height: 1 * thickness,
			}}
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

	const radius = useMemo(() => size / 2 - thickness / 2, [size, thickness])
	const circumference = useMemo(() => 2 * Math.PI * radius, [radius])

	const strokeDashOffsetBuffer = useMemo(
		() => ((100 - normalizedBuffer) / 100) * circumference,
		[normalizedBuffer, circumference]
	)
	const strokeDashOffset = useMemo(
		() => ((100 - normalizedValue) / 100) * circumference,
		[normalizedValue, circumference]
	)

	const diameter = useMemo(
		() => (radius / (1 - thickness / size)) * 2,
		[thickness, size, radius]
	)
	const strokeWidth = useMemo(
		() => (thickness / size) * diameter,
		[thickness, size, diameter]
	)

	const progressCircle = () => (
		<div
			{...attrs}
			style={{
				width: diameter,
				height: diameter,
			}}
			className={cls('dmc-progress-circular', className, {
				'dmc-progress-circular--indeterminate': indeterminate,
				'dmc-progress-circular--reverse': reverse,
				[`text-${color}`]: color,
			})}
		>
			<svg
				style={{
					transform: `rotate(-90deg)`,
				}}
				xmlns='http://www.w3.org/2000/svg'
				viewBox={`0 0 ${diameter} ${diameter}`}
			>
				<defs>
					<linearGradient id='gradient' x1='0%' y1='0%' x2='0%' y2='100%'>
						<stop offset='0%' stopColor='rgb(var(--dmc-color-primary))' />
						<stop offset='25%' stopColor='rgb(var(--dmc-color-accent))' />
						<stop offset='50%' stopColor='rgb(var(--dmc-color-info))' />
						<stop offset='75%' stopColor='rgb(var(--dmc-color-positive))' />
						<stop offset='100%' stopColor='rgb(var(--dmc-color-secondary))' />
					</linearGradient>
				</defs>
				<circle
					className='dmc-progress-circular__underlay'
					fill='transparent'
					cx='50%'
					cy='50%'
					r={radius}
					strokeWidth={strokeWidth}
					strokeDasharray={circumference}
					strokeDashoffset={
						(reverse ? '-' : '') + (!indeterminate ? strokeDashOffsetBuffer : 0)
					}
				/>

				<circle
					className={cls('dmc-progress-circular__overlay')}
					fill='transparent'
					cx='50%'
					cy='50%'
					r={radius}
					strokeWidth={strokeWidth}
					strokeDasharray={circumference}
					strokeDashoffset={(reverse ? '-' : '') + strokeDashOffset}
				/>
			</svg>
			{children && (
				<div className='dmc-progress-circular__label'>{children}</div>
			)}
			{!indeterminate && !children && label && (
				<div className='dmc-progress-circular__label'>{value}%</div>
			)}
		</div>
	)

	return type === 'bar' ? progressBar() : progressCircle()
}

export const DmcProgress = memo(DmcProgressRoot)

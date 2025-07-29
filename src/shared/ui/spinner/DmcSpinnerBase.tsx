import { cls } from '../../utils'
import './style.css'

export interface SpinnerBaseProps {
	children?: React.ReactNode
	className?: string
	color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger'
	size?: string | number
	viewBox?: string
	preserveAspectRatio?: string
	xmlns?: string
	fill?: string
	stroke?: string
}

export function DmcSpinnerBase({
	children,
	className,
	size = '1em',
	color,
	viewBox = '0 0 100 100',
	...props
}: SpinnerBaseProps) {
	return (
		<svg
			className={cls(
				'dmc-spinner',
				{
					[`text-${color}`]: color,
				},
				className
			)}
			width={size}
			height={size}
			viewBox={viewBox}
			xmlns='http://www.w3.org/2000/svg'
			{...props}
		>
			{children}
		</svg>
	)
}

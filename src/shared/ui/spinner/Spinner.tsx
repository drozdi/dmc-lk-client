import { memo } from 'react'
import { SpinnerBase } from './SpinnerBase'
import classes from './style.module.css'

interface SpinnerProps {
	size?: string
	thickness?: number
	color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger'
}

function SpinnerRoot({ size = '1em', thickness = 5, color }: SpinnerProps) {
	return (
		<SpinnerBase className={classes.spinner_mat} size={size} color={color} viewBox='25 25 50 50'>
			<circle
				className={classes.spinner__path}
				cx='50'
				cy='50'
				r='20'
				fill='none'
				stroke='currentColor'
				strokeWidth={thickness}
				strokeMiterlimit='10'
			></circle>
		</SpinnerBase>
	)
}

export const Spinner = memo(SpinnerRoot)

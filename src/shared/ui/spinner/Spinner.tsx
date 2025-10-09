import { SpinnerBase } from './SpinnerBase'

interface SpinnerProps {
	size?: string
	thickness?: number
	color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger'
}
export function Spinner({ size = '1em', thickness = 5, color }: SpinnerProps) {
	return (
		<SpinnerBase className='dmc-spinner--mat' size={size} color={color} viewBox='25 25 50 50'>
			<circle
				className='dmc-spinner__path'
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

import { DmcSpinnerBase } from './DmcSpinnerBase'

interface SpinnerProps {
	size?: string
	thickness?: number
	color?: string
}
export function DmcSpinner({
	size = '1em',
	thickness = 5,
	color,
}: SpinnerProps) {
	return (
		<DmcSpinnerBase
			className='dmc-spinner--mat'
			size={size}
			color={color}
			viewBox='25 25 50 50'
		>
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
		</DmcSpinnerBase>
	)
}

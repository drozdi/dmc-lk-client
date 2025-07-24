import { DmcSpinnerClock } from '../spinner'

import './style.css'

interface LoadingProps {
	children: React.ReactNode
	active?: boolean
}

export function DmcLoading({ children, active }: LoadingProps) {
	if (active) {
		return (
			<div className='dmc-loading'>
				<DmcSpinnerClock size='5rem' color='primary' />
			</div>
		)
	}
	return children
}

import { SpinnerClock } from '../spinner'

import './style.css'

interface LoadingProps {
	children: React.ReactNode
	active?: boolean
}

export function Loading({ children, active }: LoadingProps) {
	if (active) {
		return (
			<div className='mdc-loading'>
				<SpinnerClock size='5rem' color='primary' />
			</div>
		)
	}
	return children
}

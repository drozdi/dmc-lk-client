import { DmcSpinnerClock } from '../spinner'

import './style.css'

interface LoadingProps {
	children: React.ReactNode
	active?: boolean
	keepMounted?: boolean
}

export function DmcLoading({ children, active, keepMounted }: LoadingProps) {
	if (keepMounted) {
		return (
			<div className='dmc-loading-container'>
				{children}
				{active && (
					<div className='dmc-loading'>
						<DmcSpinnerClock size='5rem' color='primary' />
					</div>
				)}
			</div>
		)
	}
	if (active) {
		return (
			<div className='dmc-loading'>
				<DmcSpinnerClock size='5rem' color='primary' />
			</div>
		)
	}
	return children
}

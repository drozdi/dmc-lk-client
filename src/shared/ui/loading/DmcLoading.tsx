import { cls } from '../../utils'
import { DmcSpinnerClock } from '../spinner'
import './style.css'

interface LoadingProps {
	children: React.ReactNode
	active?: boolean
	keepMounted?: boolean
	className?: string
}

export function DmcLoading({
	children,
	className,
	active,
	keepMounted,
}: LoadingProps) {
	if (keepMounted) {
		return (
			<div className={cls('dmc-loading-container', className)}>
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

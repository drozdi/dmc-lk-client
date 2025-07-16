import { Spinner } from '../spinner'

import './style.css'

interface LoadingProps {
	children: React.ReactNode
	active?: boolean
}

export function Loading({ children, active }: LoadingProps) {
	if (active) {
		return (
			<div className='mdc-loading'>
				<Spinner size='10rem' thickness={10} />
			</div>
		)
	}
	return children
}

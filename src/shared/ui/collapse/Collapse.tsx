import { memo } from 'react'
import { cls } from '../../utils'
import './style.css'

interface CollapseProps {
	children?: React.ReactNode
	className?: string
	active?: boolean
}

export const Collapse = memo(
	({ className, children, active }: CollapseProps) => {
		return (
			<div
				className={cls(
					'mdc-collapse',
					{
						'mdc-collapse--active': active,
					},
					className
				)}
			>
				<div className='mdc-collapse-panel'>
					<div className='mdc-collapse-content'>{children}</div>
				</div>
			</div>
		)
	}
)

import { memo } from 'react'
import { cls } from '../../utils'
import './style.css'

interface CollapseProps {
	children?: React.ReactNode
	className?: string
	active?: boolean
	keepMounted?: boolean
}

export const DmcCollapse = memo(
	({ className, children, active }: CollapseProps) => {
		return (
			<div
				className={cls(
					'dmc-collapse',
					{
						'dmc-collapse--active': active,
					},
					className
				)}
			>
				<div className='dmc-collapse-panel'>
					<div className='dmc-collapse-content'>{children}</div>
				</div>
			</div>
		)
	}
)

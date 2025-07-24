import { memo } from 'react'
import { cls } from '../../utils'
import './style.css'

interface ItemLabelProps {
	children: React.ReactNode
	className?: string
	overline?: boolean
	caption?: boolean
	header?: boolean
	lines?: boolean
	[key: string]: any
}

export const DmcItemLabel = memo(
	({
		children,
		className,
		overline,
		caption,
		header,
		lines,
		...props
	}: ItemLabelProps) => {
		return (
			<div
				{...props}
				className={cls('dmc-item__label', className, {
					'dmc-item__label--overline': overline,
					'dmc-item__label--caption': caption,
					'dmc-item__label--header': header,
					'dmc-item__label--lines': lines,
				})}
			>
				{children}
			</div>
		)
	}
)

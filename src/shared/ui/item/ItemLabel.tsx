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

export const ItemLabel = memo(
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
				className={cls('mdc-item__label', className, {
					'mdc-item__label--overline': overline,
					'mdc-item__label--caption': caption,
					'mdc-item__label--header': header,
					'mdc-item__label--lines': lines,
				})}
			>
				{children}
			</div>
		)
	}
)

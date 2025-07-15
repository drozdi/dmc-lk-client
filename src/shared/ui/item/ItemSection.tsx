import { memo } from 'react'
import { cls } from '../../utils'
import './style.css'

interface ItemSectionProps {
	children?: React.ReactNode
	className?: string
	side?: boolean
	end?: boolean
	top?: boolean
	row?: boolean
	noWrap?: boolean
	avatar?: boolean
	thumbnail?: boolean
	[key: string]: any
}

export const ItemSection = memo(
	({
		children,
		className,
		side,
		top,
		end,
		noWrap,
		row,
		avatar,
		thumbnail,
		...props
	}: ItemSectionProps) => {
		const isSide = side || thumbnail || avatar
		return (
			<div
				{...props}
				className={cls('mdc-item__section', className, {
					'mdc-item__section--main': !isSide,
					'mdc-item__section--side': isSide,
					'mdc-item__section--top': top,
					'mdc-item__section--row': row,
					'mdc-item__section--end': end,
					'mdc-item__section--nowrap': noWrap,
					'mdc-item__section--avatar': avatar,
					'mdc-item__section--thumbnail': thumbnail,
				})}
			>
				{children}
			</div>
		)
	}
)

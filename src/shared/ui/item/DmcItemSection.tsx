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

export const DmcItemSection = memo(
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
				className={cls('dmc-item__section', className, {
					'dmc-item__section--main': !isSide,
					'dmc-item__section--side': isSide,
					'dmc-item__section--top': top,
					'dmc-item__section--row': row,
					'dmc-item__section--end': end,
					'dmc-item__section--nowrap': noWrap,
					'dmc-item__section--avatar': avatar,
					'dmc-item__section--thumbnail': thumbnail,
				})}
			>
				{children}
			</div>
		)
	}
)

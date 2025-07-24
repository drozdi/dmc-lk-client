import { memo } from 'react'
import { render } from '../../internal/render'
import { capitalize, cls } from '../../utils'
import './style.css'

interface MarkupTableProps {
	children?: React.ReactNode
	className?: string
	striped?: boolean
	hover?: boolean
	dense?: boolean
	rowBorder?: boolean
	colBorder?: boolean
	border?: boolean
	layout?: 'auto' | 'fixed'
	showTitle?: boolean
}
interface MarkupTableElementProps {
	children?: React.ReactNode
	className?: string
	[key: string]: any
}
interface MarkupTableCaptionProps extends MarkupTableElementProps {
	side?: 'top' | 'bottom'
}

export const DmcMarkupTable = memo(
	({
		children,
		className,
		striped,
		hover,
		dense,
		rowBorder,
		colBorder,
		border,
		layout,
		showTitle,
		...props
	}: MarkupTableProps) => {
		return render('table', {
			...props,
			className: cls(
				'dmc-table',
				{
					'dmc-table--striped': striped,
					'dmc-table--hover': hover,
					'dmc-table--dense': dense,
					'dmc-table--row-border': rowBorder,
					'dmc-table--col-border': colBorder,
					'dmc-table--border': border,
					'dmc-table--show-title': showTitle,
					[`dmc-table--${layout}`]: layout,
				},
				className
			),
			children,
		})
	}
)

'tr td th thead tbody tfoot caption'.split(/\s+/).forEach(name => {
	DmcMarkupTable[capitalize(name)] = memo(
		({ children, className, ...props }: MarkupTableElementProps) => {
			return render(name, {
				...props,
				className: cls('dmc-table-' + name, className),
				children,
			})
		}
	)
	DmcMarkupTable[capitalize(name)].displayName =
		'MarkupTable' + capitalize(name)
})

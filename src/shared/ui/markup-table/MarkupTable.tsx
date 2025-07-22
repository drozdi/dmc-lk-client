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

export const MarkupTable = memo(
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
				'mdc-table',
				{
					'mdc-table--striped': striped,
					'mdc-table--hover': hover,
					'mdc-table--dense': dense,
					'mdc-table--row-border': rowBorder,
					'mdc-table--col-border': colBorder,
					'mdc-table--border': border,
					'mdc-table--show-title': showTitle,
					[`mdc-table--${layout}`]: layout,
				},
				className
			),
			children,
		})
	}
)

'tr td th thead tbody tfoot caption'.split(/\s+/).forEach(name => {
	MarkupTable[capitalize(name)] = memo(
		({ children, className, ...props }: MarkupTableElementProps) => {
			return render(name, {
				...props,
				className: cls('mdc-table-' + name, className),
				children,
			})
		}
	)
	MarkupTable[capitalize(name)].displayName = 'MarkupTable' + capitalize(name)
})

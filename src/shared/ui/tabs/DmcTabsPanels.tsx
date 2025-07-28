import { cls } from '../../utils'
import './styles.css'

interface TabsPanelsProps {
	className?: string
	children?: React.ReactNode
}

export function DmcTabsPanels({
	className,
	children,
	...props
}: TabsPanelsProps) {
	return (
		<div {...props} className={cls('dmc-tabs-panels', className)}>
			{children}
		</div>
	)
}

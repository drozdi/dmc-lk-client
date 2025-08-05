import { useMemo } from 'react'
import { DmcIcon } from '../icon'

export function processSection(
	section?: React.ReactNode,
	className: string = 'dmc-input-section'
) {
	return useMemo(() => {
		if (!section) {
			return null
		}
		return (
			<span className={className}>
				{typeof section === 'string' ? <DmcIcon>{section}</DmcIcon> : section}
			</span>
		)
	}, [section])
}

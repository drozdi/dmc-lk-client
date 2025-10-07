import { useMemo } from 'react'
import { Icon } from '../icon'

export function processSection(section?: React.ReactNode, className: string = 'dmc-input-section') {
	return useMemo(() => {
		if (!section) {
			return null
		}
		return <span className={className}>{typeof section === 'string' ? <Icon>{section}</Icon> : section}</span>
	}, [section])
}

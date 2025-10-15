import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useConsumption, useLabelFormat } from '../stores/hooks'

export const LablesConsumption = observer(() => {
	const c = useConsumption()
	const lf = useLabelFormat()

	useMemo(() => {}, [lf])
	useEffect(() => {
		c.load()
	}, [])
	console.log(c)
	return ''
})

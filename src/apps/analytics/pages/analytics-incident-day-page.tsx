import { Group, Paper, Text } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { IncidentDay } from '../features/incident/day'

export function AnalyticsIncidentDayPage() {
	let [searchParams] = useSearchParams()
	const [day, setDay] = useState(dayjs(searchParams.get('day') || undefined).format('YYYY-MM-DD'))
	return (
		<Paper>
			<Group justify='space-between'>
				<Text>Инциденты за</Text>
				<DatePickerInput value={day} onChange={setDay} />
			</Group>
			<IncidentDay day={day} />
		</Paper>
	)
}

import { Group, Paper, Text } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { Template } from '@t'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { IncidentDay } from '../features/incident/day'

export function AnalyticsIncidentDayPage() {
	let [searchParams] = useSearchParams()
	const [day, setDay] = useState(dayjs(searchParams.get('day') || undefined).format('YYYY-MM-DD'))
	return (
		<Paper>
			<Template.Title slot='title'>Инциденты за день</Template.Title>
			<Group justify='end'>
				<Text>Дата:</Text>
				<DatePickerInput value={day} onChange={setDay} />
			</Group>
			<IncidentDay day={day} />
		</Paper>
	)
}

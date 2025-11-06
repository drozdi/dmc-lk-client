import { Group, Paper, Text } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Template } from '../../../layout'
import { IncidentDay } from '../features/incident/day'

export function AnalyticsIncidentDayPage() {
	let [searchParams] = useSearchParams()
	const [day, setDay] = useState(dayjs(searchParams.get('day') || undefined).format('YYYY-MM-DD'))
	return (
		<Paper>
			<Template.Title>Инциденты за день</Template.Title>
			<Group justify='end'>
				<Text>Дата:</Text>
				<DatePickerInput value={day} onChange={val => setDay(val as string)} />
			</Group>
			<IncidentDay day={day} />
		</Paper>
	)
}

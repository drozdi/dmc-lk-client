import { Group, Paper, Text } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { TemplateTitle } from '@t'
import dayjs from 'dayjs'
import { useState } from 'react'
import { IncidentAll } from '../features/incident/all'

export function AnalyticsIncidentListPage() {
	const day = dayjs()
	const [query, setQuery] = useState<IAnalyticsIncidentQuery>({
		limit_page: 1000,
		filterdate: [day.month(day.month() - 3).format('YYYY-MM-DD'), day.format('YYYY-MM-DD')],
		data: [],
		fields_name: [],
		details_field: [],
	})

	function handleDate(index: number, value: string) {
		const newFilterdate = [...query.filterdate]
		newFilterdate[index] = value
		setQuery({ ...query, filterdate: newFilterdate })
	}

	return (
		<Paper>
			<TemplateTitle slot='title'>Инциденты</TemplateTitle>
			<Group justify='end'>
				<Text>С</Text>
				<DatePickerInput
					name='filterdate_from'
					value={query?.filterdate?.[0] || ''}
					onChange={value => handleDate(0, value)}
				/>
				<Text>по</Text>
				<DatePickerInput
					name='filterdate_to'
					value={query?.filterdate?.[1] || ''}
					onChange={value => handleDate(1, value)}
				/>
			</Group>
			<IncidentAll mt='xs' query={query} />
		</Paper>
	)
}

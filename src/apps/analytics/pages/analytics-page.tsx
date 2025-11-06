import { Group, Paper, SimpleGrid, Text } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { Template } from '@t'
import dayjs from 'dayjs'
import { useState } from 'react'
import { AnalyticEventWidget } from '../widgets/analytic-event-widget'
import { AnalyticPieWidget } from '../widgets/analytic-pie-widget'
import { AnalyticTypeWidget } from '../widgets/analytic-type-widget'

const dNow = dayjs('2025-08-02')

export function AnalyticsPage() {
	const [query, setQuery] = useState<Omit<IAnalyticsQuery, 'step' | 'event'>>({
		filterdate_from: dNow.month(dNow.month() - 6).format('YYYY-MM-DD'),
		filterdate_to: dNow.format('YYYY-MM-DD'),
	})
	const [errors, setErrors] = useState<Record<string, string>>({})
	const handleChange = (name: string, value: any) => {
		setErrors({})
		setQuery(v => ({
			...v,
			[name]: value,
		}))
		validate()
	}
	function validate() {
		try {
			if (!query.filterdate_from && !query.filterdate_to) {
				if (!query.filterdate_from) {
					errors.filterdate_from = 'Поле обязательно для заполнения'
				}
				if (!query.filterdate_to) {
					errors.filterdate_to = 'Поле обязательно для заполнения'
				}
			}
			setErrors(errors)
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<Paper>
			<Template.Title>Аналитика</Template.Title>
			<Group justify='center'>
				<Text>C</Text>
				<DatePickerInput
					name='filterdate_from'
					value={query.filterdate_from}
					onChange={value => handleChange('filterdate_from', value)}
					error={errors?.filterdate_from}
				/>
				<Text>по</Text>
				<DatePickerInput
					name='filterdate_to'
					value={query.filterdate_to}
					onChange={value => handleChange('filterdate_to', value)}
					error={errors?.filterdate_to}
				/>
			</Group>

			<SimpleGrid mt='xs' cols={2}>
				<AnalyticEventWidget {...query} step='mon' />
				<AnalyticPieWidget {...query} step='mon' />
				<AnalyticTypeWidget {...query} step='mon' />
			</SimpleGrid>
		</Paper>
	)
}

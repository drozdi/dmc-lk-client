import { useEffect, useState } from 'react'
import { DmcFullscreen, Input } from '../../../shared/ui'
import { AnalyticAllWidget } from '../widgets/analytic-all-widget'
import { AnalyticEventWidget } from '../widgets/analytic-event-widget'
import { AnalyticTypeWidget } from '../widgets/analytic-type-widget'

export function AnalyticsPage() {
	const [query, setQuery] = useState<Omit<IAnalyticsQuery, 'step' | 'event'>>({
		filterdate_from: '2024-05-24',
		filterdate_to: '2024-07-24',
	})
	const [errors, setErrors] = useState<Record<string, string>>({})

	const handleChange = ({ target }: React.ChangeEvent) => {
		setErrors({})
		setQuery(v => ({
			...v,
			[target.name]: target.value,
		}))
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

	useEffect(() => {
		console.log(query)
	}, [query])

	return (
		<div>
			<div className='flex gap-0 justify-center'>
				<Input
					value={query.filterdate_from}
					label='С'
					type='date'
					name='filterdate_from'
					onChange={handleChange}
					dense
					square
					filled
					underlined
					errorMessage={errors?.filterdate_from}
				/>
				<Input
					value={query.filterdate_to}
					label='по'
					type='date'
					name='filterdate_to'
					onChange={handleChange}
					dense
					square
					filled
					underlined
					errorMessage={errors?.filterdate_to}
				/>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl'>
				<DmcFullscreen>
					<AnalyticEventWidget {...query} step='mon' />
				</DmcFullscreen>
				<DmcFullscreen>
					<AnalyticAllWidget {...query} step='mon' />
				</DmcFullscreen>
				<DmcFullscreen>
					<AnalyticTypeWidget {...query} step='mon' />
				</DmcFullscreen>
			</div>
		</div>
	)
}

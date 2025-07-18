import { useState } from 'react'
import { Btn, Fullscreen, Input, Select } from '../../../shared/ui'
import { mapEvent, mapStep } from '../entites/constants'
import { AnalyticAllWidget } from '../widgets/analytic-all-widget'
import { AnalyticEventWidget } from '../widgets/analytic-event-widget'
import { AnalyticTypeWidget } from '../widgets/analytic-type-widget'

export function AnalyticsPage() {
	const [query, setQuery] = useState<IAnalyticsQuery>({
		step: '',
		event: '',
	})
	const [params, setParams] = useState<IAnalyticsQuery>({})
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
			if (!query.step) {
				errors.step = 'Поле обязательно для заполнения'
			}
			if (!query.event) {
				errors.event = 'Поле обязательно для заполнения'
			}
			setErrors(errors)
		} catch (error) {
			console.error(error)
		}
	}

	async function sendFormData() {
		validate()
		setParams({ ...query })
		//setQuery({})
	}

	return (
		<div>
			<div className='flex gap-0 items-start'>
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
				<Select
					label='Шаг'
					value={query.step}
					name='step'
					onChange={handleChange}
					dense
					square
					filled
					underlined
					required
					errorMessage={errors?.step}
				>
					<option value='' selected disabled>
						Шаг
					</option>
					{Object.keys(mapStep).map(key => (
						<option key={key} value={key}>
							{mapStep[key]}
						</option>
					))}
				</Select>
				<Select
					label='Событие'
					value={query.event}
					name='event'
					onChange={handleChange}
					dense
					square
					filled
					underlined
					required
					errorMessage={errors?.event}
				>
					<option value='' selected disabled>
						Событие
					</option>
					{Object.keys(mapEvent).map(key => (
						<option key={key} value={key}>
							{mapEvent[key]}
						</option>
					))}
				</Select>
				<Btn color='primary' size='sm' square onClick={sendFormData}>
					Отправить
				</Btn>
			</div>

			<div className='grid grid-cols-2 gap-6 *:max-h-156'>
				<Fullscreen>
					<AnalyticEventWidget filterdate_from='2024-05-16' step='mon' />
				</Fullscreen>
				<Fullscreen>
					<AnalyticAllWidget filterdate_from='2024-05-16' step='mon' />
				</Fullscreen>
				<Fullscreen>
					<AnalyticTypeWidget filterdate_from='2024-05-16' step='mon' />
				</Fullscreen>
				<div></div>
			</div>
		</div>
	)
}

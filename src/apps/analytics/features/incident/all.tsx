import dayjs from 'dayjs'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import {
	DmcBtn,
	DmcInput,
	DmcItem,
	DmcItemExpansion,
	DmcItemLabel,
	DmcList,
	DmcLoading,
} from '../../../../shared/ui'
import { requestAnalyticsIncident } from '../../api'
import { Detail } from './components/detail'

export const AllIncident = observer(() => {
	const day = dayjs()
	const [isLoading, setLoading] = useState(false)
	const [data, setData] = useState([])
	const [query, setQuery] = useState({
		limit_page: 1000,
		filterdate: [
			day.month(day.month() - 3).format('YYYY-MM-DD'),
			day.format('YYYY-MM-DD'),
		],
		data: [],
		fields_name: [],
		details_field: [],
	})
	const handleDate = (index, date) => {
		if (index === 0) {
			setQuery(v => ({
				...v,
				filterdate: [date, v.filterdate?.[1]],
			}))
		} else {
			setQuery(v => ({
				...v,
				filterdate: [v.filterdate?.[0], date],
			}))
		}
	}

	async function fetch() {
		setLoading(true)
		try {
			const res = await requestAnalyticsIncident(query)
			setData(res?.message)
		} catch (error) {
		} finally {
			setLoading(false)
		}
	}

	return (
		<div>
			<div className='flex gap-3 justify-end items-start'>
				<div className='flex gap-0 items-start justify-end'>
					<DmcInput
						label='С'
						type='date'
						name='filterdate_from'
						dense
						square
						filled
						underlined
						value={query.filterdate?.[0] || ''}
						onChange={({ target }) => handleDate(0, target.value)}
					/>
					<DmcInput
						label='по'
						type='date'
						name='filterdate_to'
						dense
						square
						filled
						underlined
						value={query.filterdate?.[1] || ''}
						onChange={({ target }) => handleDate(1, target.value)}
					/>
				</div>
				<DmcBtn color='info' onClick={() => fetch()}>
					Применить
				</DmcBtn>
			</div>
			<DmcLoading active={isLoading} keepMounted>
				<DmcList as='div' separator>
					{data.length ? (
						data.map((item, index) => (
							<DmcItemExpansion
								as='div'
								key={item.data}
								label={item.data}
								rightSection={item.total_counter}
							>
								<Detail {...query} data={[item.data]} />
							</DmcItemExpansion>
						))
					) : (
						<DmcItem>
							<DmcItemLabel>пусто</DmcItemLabel>
						</DmcItem>
					)}
				</DmcList>
			</DmcLoading>
		</div>
	)
})

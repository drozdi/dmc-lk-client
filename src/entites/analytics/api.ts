import { useState } from 'react'
import { api } from '../../shared/api'
export function useAnalytics() {
	const [isLoading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState()
	const request = async (params: IAnalyticsQuery) => {
		setLoading(true)
		try {
			const url = ['filterdate_from', 'filterdate_to', 'step', 'event']
				.reduce(
					(acc, key) =>
						acc + (params[key] ? `${key.split('_')[0]}=${params[key]}&` : ''),
					'/analytics/?'
				)
				.replace(/&$/g, '')
			console.log(url)
			const res = await api.get(url)
			return res.data
		} catch (error) {
			if (error.response) {
				setError(error.response.data)
			} else {
				setError(error)
			}
		} finally {
			setLoading(false)
		}
	}
	return {
		isLoading,
		error,
		request,
	}
}

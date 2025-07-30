import { useState } from 'react'

export function useQuery(handleRequest: Function) {
	const [isLoading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string>()
	const request = async (...args: any[]) => {
		setLoading(true)
		try {
			return await handleRequest(...args)
		} catch (error) {
			setError(error?.response?.data?.detail || error?.message || 'Ошибка')
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

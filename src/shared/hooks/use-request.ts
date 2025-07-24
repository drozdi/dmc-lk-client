import { useState } from 'react'

export function useRequest(handleRequest: Function) {
	const [isLoading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState()
	const request = async (...args: any[]) => {
		setLoading(true)
		try {
			const res = await handleRequest(...args)
			return res.data
		} catch (error) {
			setError(error.response?.data?.detail || error.message || 'Ошибка')
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

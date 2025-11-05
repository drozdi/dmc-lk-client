import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

export function useQuery(handleRequest: Function, errorMes = 'Неизвестная ошибка'): IQuery {
	const [isLoading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string>('')
	const request = async (...args: unknown[]) => {
		setLoading(true)
		try {
			return await handleRequest(...args)
		} catch (error) {
			setError(error?.response?.data?.detail || error?.message || errorMes)
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

export function useQueryLoading(...queries: IQuery[]): boolean {
	return useMemo<boolean>(() => queries.some(query => query.isLoading), [queries.map(query => query.isLoading)])
}
export function useQueryError(...queries: IQuery[]): string {
	return useMemo<string>(
		() => queries.reduce((acc, query) => acc || query.error, ''),
		[queries.map(query => query.error)]
	)
}

export function useQuery_(
	queryKey: string[],
	queryFn: Function,
	{
		errorMes = 'Неизвестная ошибка',
		select,
		...props
	}: {
		errorMes?: string
		select?: Function
		[props: string]: any
	}
) {
	const queryClient = useQueryClient()
	const [error, setError] = useState<string>('')
	const [isLoading, setLoading] = useState<boolean>(false)
	const [data, setData] = useState<any>(null)
	return {
		data,
		isLoading,
		error,
		async fetch(query?: any) {
			setLoading(true)
			try {
				const res = await queryClient.fetchQuery({
					...props,
					queryKey: queryKey.concat(query),
					queryFn: async () => await queryFn(query),
				})
				setData(select?.(res) || res)
				return res
			} catch (error) {
				setError(error?.response?.data?.detail || error?.message || errorMes)
			} finally {
				setLoading(false)
			}

			return undefined
		},
	}
}

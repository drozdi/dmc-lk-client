import { useCallback } from 'react'
import { userStore } from '../user-store'
export function useProduction() {
	const { products } = userStore
	return {
		productionById: useCallback(id => products.find(item => item?.production_id === id), [products]),
		productionNameById: useCallback(
			id => products.find(item => String(item?.production_id) === String(id))?.name_production,
			[products]
		),
	}
}

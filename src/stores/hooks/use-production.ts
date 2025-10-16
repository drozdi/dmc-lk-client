import { useCallback } from 'react'
import { userStore } from '../user-store'
export function useProduction() {
	const { products } = userStore
	const productionById = useCallback(
		id => products.find(item => String(item?.production_id) === String(id)),
		[products]
	)
	const productionNameById = useCallback(id => productionById(id)?.name_production, [productionById])
	return {
		productionById,
		productionNameById,
	}
}

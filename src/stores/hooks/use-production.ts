import { useCallback } from 'react'
import { userStore } from '../user-store'
export function useProduction() {
	const productionById = useCallback(
		id => userStore.products.find(item => String(item?.production_id) === String(id)),
		[]
	)
	const productionNameById = useCallback(id => productionById(id)?.name_production, [productionById])
	return {
		products: userStore.products,
		productionById,
		productionNameById,
	}
}

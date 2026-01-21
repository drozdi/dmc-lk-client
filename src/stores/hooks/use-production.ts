import { useCallback } from 'react'
import { userStore } from '../user-store'
export function useProduction() {
	const productionById = useCallback(
		(id: string) => userStore.products.find(item => String(item?.production_id) === String(id)),
		[userStore.products]
	)
	const productionNameById = useCallback((id: string) => productionById(id)?.name_production, [productionById])
	return {
		products: userStore.products,
		productionById,
		productionNameById,
	}
}

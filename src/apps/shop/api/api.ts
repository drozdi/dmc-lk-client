import { api } from '../../../shared/api'

export async function getProducts({
	group,
	size,
	last,
}: {
	group?: string
	last?: string
	size?: number
} = {}) {
	const res = await api.get('/products/', {
		params: {
			size,
			code: last,
			group_code: group,
		},
	})
	return res.data.message
}

export async function addItemCart(product: IShopProduct) {
	const res = await api.post('/basket/save_basket', {
		product_code: product.product_code,
		count_product: product.count_product,
	})
	return res.data.data
}
export async function removeItemCart(id) {
	const res = await api.delete(`/basket/?id_record=${id}`)
	return res.data.data
}
export async function updateItemCart(id, item) {
	const res = await api.patch(`/basket/?id_record=${id}`, item)
	return res.data.data
}
export async function getCart() {
	const res = await api.get('/basket/', {
		params: {},
	})
	return res.data.data
}

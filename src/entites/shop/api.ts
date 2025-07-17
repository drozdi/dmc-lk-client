import { api } from '../../shared/api'

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
	console.log(product)
	const res = await api.post('/basket/save_basket', {
		product_code: product.product_code,
		count_product: product.count_product,
	})
	return res.data.data
}
export async function removeItemCart() {}
export async function getCart() {
	const res = await api.get('/basket/', {
		params: {},
	})
	return res.data.data
}

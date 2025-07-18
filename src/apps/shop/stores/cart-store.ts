import { makeAutoObservable } from 'mobx'
import {
	addItemCart,
	getCart,
	removeItemCart,
	updateItemCart,
} from '../api/api'
class CartStore {
	list = []
	error = null
	opened = false
	isLoading = false
	constructor() {
		makeAutoObservable(this)
		this.load()
	}
	open() {
		this.opened = true
	}
	close() {
		this.opened = false
	}
	toogle() {
		this.opened = !this.opened
	}
	get ids() {
		if (this.list.length) {
			return this.list.map(item => this.getId(item))
		} else {
			return []
		}
	}
	get totalPrice() {
		if (this.list.length) {
			return this.list.reduce(
				(acc, item) => acc + item.price * item.count_product,
				0
			)
		} else {
			return 0
		}
	}
	private async load() {
		this.isLoading = true
		try {
			const data = await getCart()
			this.list = data?.request || []
		} catch (e) {
			this.error = e.message
		} finally {
			this.isLoading = false
		}
	}
	private getId(item: any) {
		return item?.id || item || null
	}
	async addToCart(product: IShopProduct) {
		try {
			const response = await addItemCart({
				count_product: 1,
				...product,
			})
			this.list.push(response)
		} catch (e) {
			console.error(e)
		}
		/*if (this.ids.includes(this.getId(product))) {
			this.list = this.list.map(item =>
				this.getId(item) === this.getId(product)
					? { ...item, count_product: item.count_product + 1 }
					: item
			)
		} else {
			this.list.push({
				count_product: 1,
				...product,
			})
		}*/
		//this.save()
	}
	async removeFromCart(rItem) {
		await removeItemCart(this.getId(rItem))
		this.list = this.list.filter(item => this.getId(item) !== this.getId(rItem))
	}
	async setCountProduct(id, count_product) {
		if (count_product > 0) {
			const updatedItem = await updateItemCart(id, {
				count_product,
			})
			this.list = this.list.map(item =>
				this.getId(item) === this.getId(updatedItem) ? updatedItem : item
			)
		} else {
			this.removeFromCart(id)
		}
	}
	getCountProduct(id) {
		if (this.ids.includes(id)) {
			return this.list.find(item => this.getId(item) === this.getId(id))
				.count_product
		} else {
			return 0
		}
	}
	getProduct(id) {
		if (this.ids.includes(id)) {
			return this.list.find(item => this.getId(item) === this.getId(id))
		} else {
			return null
		}
	}
}

export const cartStore = new CartStore()

import { makeAutoObservable } from 'mobx'
import {
	addItemCart,
	getCart,
	getProductByCode,
	removeItemCart,
	updateItemCart,
} from '../api/api'
class CartStore {
	_list = []
	error = null
	opened = false
	isLoading = false
	isLoaded = false
	constructor() {
		makeAutoObservable(this)
	}
	get list() {
		this.load()
		return this._list
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
	get totalPrice() {
		if (this._list.length) {
			return this._list.reduce(
				(acc, item) => acc + item.price * item.count_product,
				0
			)
		} else {
			return 0
		}
	}
	private async load(reloding: boolean = false) {
		if (reloding) {
			this.isLoaded = false
			this._list = []
		}
		if (this.isLoaded) {
			return
		}
		this.isLoading = true
		try {
			const data = await getCart()
			this.isLoaded = true
			this._list = data?.request || []
			for (let i in this._list) {
				this._list[i] = {
					...this._list[i],
					...(await getProductByCode(this._list[i].product_code)),
				}
			}
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
			this._list.push(response)
		} catch (e) {
			console.error(e)
		}
	}
	async removeFromCart(rItem) {
		await removeItemCart(this.getId(rItem))
		this._list = this._list.filter(
			item => this.getId(item) !== this.getId(rItem)
		)
	}
	async setCountProduct(id, count_product) {
		if (count_product > 0) {
			const updatedItem = await updateItemCart(id, {
				count_product,
			})
			this._list = this._list.map(item =>
				this.getId(item) === this.getId(updatedItem) ? updatedItem : item
			)
		} else {
			this.removeFromCart(id)
		}
	}
	getCountProduct(id) {
		return (
			this._list.find(item => this.getId(item) === this.getId(id))
				.count_product || 0
		)
	}
	getProduct(id) {
		return this._list.find(item => this.getId(item) === this.getId(id))
	}
}

export const cartStore = new CartStore()

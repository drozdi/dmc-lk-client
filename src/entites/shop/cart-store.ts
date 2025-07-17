import { makeAutoObservable } from 'mobx'
import { addItemCart, getCart } from './api'
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
	private async save() {
		this.isLoading = true
		try {
			localStorage.setItem('shop.cart', JSON.stringify(this.list))
			//const response = await fetch('http://localhost:3000/cart', {})
		} catch (e) {
			this.error = e.message
		} finally {
			this.isLoading = false
		}
	}
	private async load() {
		this.isLoading = true
		try {
			const data = await getCart()
			//const data = localStorage.getItem('shop.cart')
			if (data) {
				this.list = JSON.parse(data)
				localStorage.setItem('shop.cart', JSON.stringify(data))
			}
		} catch (e) {
			this.error = e.message
		} finally {
			this.isLoading = false
		}
	}
	private getId(item: any) {
		return item?.product_code || item || null
	}
	async addToCart(product: IShopProduct) {
		console.log(product)
		try {
			const response = await addItemCart({
				count_product: 1,
				...product,
			})
			console.log(response)
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
	removeFromCart(id) {
		this.list = this.list.filter(item => {
			return this.getId(item) !== this.getId(id)
		})
		this.save()
	}
	clearCart() {
		if (window.confirm('Вы уверены?')) {
			this.list = []
			this.save()
		}
	}
	setCountProduct(id, count_product) {
		if (count_product > 0) {
			this.list = this.list.map(item =>
				this.getId(item) === this.getId(id) ? { ...item, count_product } : item
			)
			this.save()
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

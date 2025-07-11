import { makeAutoObservable } from 'mobx'

class Request {
	config: any = null
	pending: boolean = false
	
	constructor() {
		makeAutoObservable(this)
	}
	start(config: any) {
		this.config = config
		this.pending = true
	}
	stop() {
		this.config = null
		this.pending = false
	}
}

export const RequestStore = new Request()

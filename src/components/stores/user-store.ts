import { makeAutoObservable } from 'mobx'

class UserStore {
	constructor() {
		makeAutoObservable(this)
	}
}

export const userStore = new UserStore()

import { makeAutoObservable } from 'mobx'
class UsersStores {
	constructor() {
		makeAutoObservable(this)
	}
}

export const usersStores = new UsersStores()

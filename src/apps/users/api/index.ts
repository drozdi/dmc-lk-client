import { api } from '../../../shared/api'

export async function requestGetUsers({ size = 15, number = 0 }: { size: number; number: number }) {
	const res = await api.get('/users', {
		params: {
			size,
			number,
		},
	})
	return res.data.data
}

export async function requestGetUser(id: number) {
	const res = await api.get(`/users/?id_user=${id}`)
	return res.data.data.user.request[0]
}
export async function requestUpdateUser(id: number, data: IUsersUser) {
	const res = await api.patch(`/users/?id_user=${id}`, data)
	return res.data
}

export async function requestGetProducts() {
	const res = await api.get('/users/products')
	return res.data
}

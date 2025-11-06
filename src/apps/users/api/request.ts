import { api } from '../../../shared/api'

export async function requestUsersList({ size = 15, number = 0 }: { size?: number; number?: number } = {}) {
	const res = await api.get('/users', {
		params: {
			size,
			number,
		},
	})
	return res.data
}

export async function requestUsersGet(id: number): Promise<IResponse<IUsersUser>> {
	const res = await api.get(`/users/user?id_user=${id}`)
	return res.data
}
export async function requestUsersUpdate(id: number, data: IUsersUser): Promise<IResponse<IUsersUser>> {
	const res = await api.patch(`/users/?id_user=${id}`, data)
	return res.data
}

export async function requestUsersProducts(): Promise<IResponse<IResponseProduction[]>> {
	const res = await api.get('/users/products')
	return res.data
}

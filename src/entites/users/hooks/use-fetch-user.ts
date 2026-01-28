import { useQuery } from "@tanstack/react-query";
import { requestUsersGet } from "../../../apps/users/api/request";

export function useFetchUser(id: number | string) {
	return useQuery({
		queryKey: ["users", id],
		staleTime: 0,
		queryFn: async () => {
			try {
				const res = await requestUsersGet(Number(id));
				return res;
			} catch (error: IError) {
				const mes = `Ошибка запроса на получение пользователя с id ${id}: ${error.response.data.detail}`;
				console.error(mes);
				throw new Error(mes);
			}
			return {};
		},
		select(data) {
			return data.data;
		},
	});
}

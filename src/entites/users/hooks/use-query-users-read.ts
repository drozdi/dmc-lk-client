import { useQuery } from "@tanstack/react-query";
import { requestUsersGet } from "../api/users";

export function useQueryUsersRead(id: IUsersUser["id"]) {
	return useQuery({
		queryKey: ["users", id],
		staleTime: 0,
		queryFn: async () => {
			try {
				const res = await requestUsersGet(id);
				return res;
			} catch (error: IError) {
				const mes = `Ошибка запроса на получение пользователя с id ${id}: ${error.response.data.detail}`;
				console.error(mes);
				throw new Error(mes);
			}
		},
		select(data) {
			return data.data;
		},
	});
}

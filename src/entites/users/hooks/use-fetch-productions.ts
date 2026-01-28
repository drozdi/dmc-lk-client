import { useQuery } from "@tanstack/react-query";
import { requestUsersProducts } from "../../../apps/users/api/request";

export function useFetchProductions() {
	return useQuery({
		queryKey: ["users", "productions"],
		queryFn: async (): Promise<IResponse<IResponseProduction[]>> => {
			return await requestUsersProducts();
		},
		select(data: IResponse<IResponseProduction[]>): IProduction[] {
			return (data?.data || []).map((item) => ({
				production_id: item.production_id,
				production_name: item.name_production,
			}));
		},
	});
}

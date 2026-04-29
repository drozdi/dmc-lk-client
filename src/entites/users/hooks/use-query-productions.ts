import { type ComboboxItem } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { requestUsersProducts } from "../api/users";

export function useQueryProductions() {
	const q = useQuery({
		queryKey: ["users-productions"],
		queryFn: async () => {
			const res = await requestUsersProducts();
			if (!res.success) {
				throw new Error(
					res.message || "Список запросов: подумать над ошибкой!",
				);
			}
			return res;
		},
		select(data: IResponse<IProduction[]>): IProduction[] {
			return (data?.data || []).map((item) => ({
				production_id: item.production_id,
				production_name: item.name_production,
			}));
		},
	});
	const dataSelect = useMemo<
		ComboboxItem<IProduction["production_id"]>[]
	>(() => {
		return [
			{
				value: "0",
				label: "Все площадки",
			},
		].concat(
			(q.data || []).map((item) => ({
				value: String(item.production_id),
				label: item.production_name as string,
			})),
		);
	}, [q.data]);
	const findById = useCallback(
		(id: IProduction["production_id"]) => {
			if (id === 0) {
				return {
					production_name: "Все площадки",
				};
			}
			return (q.data || []).find((item) => item.production_id === id);
		},
		[q.data],
	);
	const findNameById = useCallback(
		(id: IProduction["production_id"]) =>
			findById(id)?.production_name || `Площадка #${id}`,
		[findById],
	);
	return { ...q, dataSelect, findById, findNameById };
}

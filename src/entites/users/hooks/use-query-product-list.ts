import { type ComboboxItem } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { requestUsersProducts } from "../api/users";
export function useQueryProductList() {
	const q = useQuery({
		queryKey: ["users-products"],
		queryFn: async () => {
			const res = await requestUsersProducts();
			if (!res.success) {
				throw new Error(
					res.message || "Список запросов: подумать над ошибкой!",
				);
			}
			return res;
		},
		select(data) {
			return data.data;
		},
	});

	const dataSelect = useMemo<ComboboxItem[]>(() => {
		return [
			{
				value: "0",
				label: "Все площадки",
			},
		].concat(
			(q.data || []).map((item) => ({
				value: String(item.production_id),
				label: item.name_production as string,
			})),
		);
	}, [q.data]);

	const findById = useCallback(
		(id: IProduction["production_id"]) =>
			(q.data || []).find((item) => item.production_id === id),
		[q.data],
	);

	const findNameById = useCallback(
		(id: IProduction["production_id"]) =>
			findById(id)?.name_production || "",
		[findById],
	);
	return { ...q, dataSelect, findById, findNameById };
}

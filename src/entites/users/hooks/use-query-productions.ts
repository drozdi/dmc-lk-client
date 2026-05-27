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
		gcTime: 1000 * 60 * 60,
		staleTime: 1000 * 60 * 60,
		select(data: IResponse<IProduction[]>): IProduction[] {
			return (data?.data || []).map((item) => ({
				...item,
				production_id: item.production_id,
				production_name: item.name_production,
			}));
		},
	});
	const dataSelect = useMemo<
		ComboboxItem<IProduction["production_id"]>[]
	>(() => {
		return (q.data || []).map((item) => ({
				value: String(item.production_id),
				label: item.production_name as string,
			}))
	}, [q.data]);
	const findById = useCallback(
		(id: IProduction["production_id"]) => {
			return (q.data || []).find((item) => String(item.production_id) === String(id));
		},
		[q.data],
	);
	const findNameById = useCallback(
		(id: IProduction["production_id"]) => findById(id)?.name_production || `Площадка #${id}`,
		[findById],
	);
	const findNameByIds = useCallback(
		(productions: IProduction["production_id"][]) =>
			q.data?.length === productions.length ? 'Все площадки' :productions.map((id) => findNameById(id)).join(', '),
		[findNameById, q.data]
	);

	return { ...q, dataSelect, findById, findNameById, findNameByIds };
}

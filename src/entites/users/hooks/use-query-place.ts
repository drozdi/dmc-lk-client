import { type ComboboxItem } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { requestUsersPlaceList } from "../api/place";

export function useQueryPlace(production: IPlace["production_id"] | IPlace["production_id"][]) {
	const productions = [].concat(production as never[]).map(Number);
	const q = useQuery({
		queryKey: ["users-place"],
		queryFn: async () => {
			const res = await requestUsersPlaceList();
			if (!res.success) {
				throw new Error(
					res.message || "Список запросов: подумать над ошибкой!",
				);
			}
			return res;
		},
		select(data: IResponse<IPlace[]>): IPlace[] {
			return data?.data || [];
		},
	});
	const dataSelect = useMemo<ComboboxItem[]>(() => {
		return [
			{
				value: "0",
				label: "Все линии",
			},
		].concat(
			(q.data || []).filter(item => productions.includes(item.production_id as never)).map((item) => ({
				value: String(item.place_id),
				label: `${item.place_name} ${item.place_type}`,
			})),
		);
	}, [q.data, JSON.stringify(productions)]);

	const findById = useCallback(
		(id: IPlace["place_id"]) => {
			if (id === 0) {
				return {
					place_name: "Все линии",
				};
			}
			return (q.data || []).find((item) => item.place_id === id);
		},
		[q.data],
	);
	const findNameById = useCallback(
		(id: IPlace["place_id"]) => {
			const item = findById(id);
			return `${item?.place_name} ${item?.place_name}` || `Линия #${id}`;
		},
		[findById],
	);
	return { ...q, dataSelect, findById, findNameById };
}

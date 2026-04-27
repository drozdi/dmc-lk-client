import { useEnumsEvents } from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { useQueryProductions } from "@/entites/users";
import { type ComboboxItem, Select } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";

interface ProductionsProps {
	data: any;
	onChange?: () => void;
}

const ee = useEnumsEvents();

function getProductions(
	productions: IAnalyticsProductionData[],
): ComboboxItem[] {
	return productions.map(
		(item) =>
			({
				value: String(item.production_id),
				label: item.name,
			}) as ComboboxItem,
	);
}

export function Productions({ data, onChange }: ProductionsProps) {
	const storeProductionId = useStoreUserProfile((state) => state.production_id);
	const [production_id, setProductionId] = useState<number>(
		Number(storeProductionId),
	);
	const qp = useQueryProductions();

	const productions = useMemo<ComboboxItem[]>(() => {
		if (data) {
			const productions = [];
			for (const key of ee.keys) {
				productions.push(...getProductions(data?.[key] || []));
			}
			return [...new Set(productions.map((item) => item.value))].map(
				(value) => ({
					value,
					label: qp.findNameById(Number(value)),
				}),
			);
		}
		return [];
	}, [data]);

	useEffect(() => {
		setProductionId(Number(storeProductionId));
	}, [storeProductionId]);

	return (
		<Select
			defaultValue={String(production_id)}
			checkIconPosition="right"
			onChange={(val) => {
				(onChange || setProductionId)?.(Number(val));
			}}
			data={[
				{
					value: "0",
					label: "Все площадки",
				},
			].concat(productions as any)}
		/>
	);
}

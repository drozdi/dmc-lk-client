import { useStoreUserProfile } from "@/entites/auth";
import { selectCountForProduction, useStoreCountLabel } from "@/entites/labels";
import { Text } from "@/shared/ui";
import { NumberFormatter } from "@mantine/core";
import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/shallow";

export interface LabelsCurrentBalanceProps {
	type?: "cnt" | "reb";
}

export const LabelsCurrentBalance = ({
	type = "cnt",
}: LabelsCurrentBalanceProps) => {
	const production_id = Number(useStoreUserProfile((state) => state.production_id)) || 0;
	const storeCountLabel = useStoreCountLabel(
		useShallow((state) => ({
			count: state.count,
			loadCount: state.loadCount,
		}))
	);
	
	const value = useMemo(() => {
		const count = selectCountForProduction(production_id)(storeCountLabel as IStoreCountLabel);
		
		let value = 0;
		const key = type === "cnt" ? "sum" : "sum_consumption";

		value = (count?.distributed || []).reduce(
			(acc, item) => acc + item[key],
			value,
		);

		value = (count?.not_distributed || []).reduce(
			(acc, item) => acc + item[key],
			value,
		);
		return value;
	}, [storeCountLabel.count, type, production_id]);

	useEffect(() => {
		storeCountLabel.loadCount();
	}, []);

	return (
		<Text fz="3rem" ta="right">
			<NumberFormatter value={value} />
		</Text>
	);
};

import { useStoreCountLabel } from "@/entites/labels";
import { Text } from "@/shared/ui";
import { NumberFormatter } from "@mantine/core";
import { useEffect, useMemo } from "react";

export interface LabelsCurrentBalanceProps {
	type?: "cnt" | "reb";
}
export const LabelsCurrentBalance = ({
	type = "cnt",
}: LabelsCurrentBalanceProps) => {
	const count = useStoreCountLabel((state) => state.count);
	
	const value = useMemo(() => {
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
	}, [count, type]);

	useEffect(() => {
		useStoreCountLabel.getState().loadCount();
	}, []);

	return (
		<Text fz="3rem" ta="right">
			<NumberFormatter value={value} />
		</Text>
	);
};

import { useStoreCountLabel } from "@/entites/labels";
import { Widget, type WidgetProps } from "@/shared/ui";

import {
	LabelsCurrentBalance,
	type LabelsCurrentBalanceProps,
} from "@/features/labels/widgets";

export interface WidgetLabelsCurrentBalanceProps
	extends WidgetProps, LabelsCurrentBalanceProps {}

export const WidgetLabelsCurrentBalance = ({
	type = "cnt",
	...props
}: WidgetLabelsCurrentBalanceProps) => {
	const isLoading = useStoreCountLabel((state) => state.isLoading);
	return (
		<Widget
			{...props}
			expanded={false}
			loading={isLoading}
			title="Текущий баланс этикеток"
			subTitle={type === "cnt" ? "Количество этикеток (шт.)" : "Метраж ленты (м.)"}
		>
			<LabelsCurrentBalance type={type} />
		</Widget>
	);
};

import { useQueryAnalytics } from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { Text, Widget, type WidgetProps } from "@/shared/ui";
import { NumberFormatter } from "@mantine/core";
import { useEffect, useMemo } from "react";

export interface WidgetMainItogSetProps extends Omit<
	WidgetProps,
	"title" | "children"
> {
	filterdate: IRequestAnalytics["filterdate"];
	title?: WidgetProps["title"];
	type?: "avg" | "min" | "max" | "sum";
}

export const WidgetMainItogSet = ({
	title,
	type = "sum",
	filterdate,
	...props
}: WidgetMainItogSetProps) => {
	const { production_id } = useStoreUserProfile();

	const { data, isLoading, error, fetch } = useQueryAnalytics({
		filterdate,
		step: "d",
		event: "p",
	});

	useEffect(() => {
		fetch();
	}, [filterdate]);

	let value = useMemo(() => {
		if (!data) {
			return 0;
		}
		const currProduction = Number(production_id) || 0;
		let cnt = 0;
		let min = -1;
		let max = -1;
		let sum = 0;
		if (["min", "max"].includes(type)) {
			data.production.forEach((item) => {
				if (currProduction > 0 && item.production_id !== currProduction) {
					return;
				}
				item.data.forEach((item) => {
					min = min === -1 ? item.count : Math.min(min, item.count);
					max = Math.max(max, item.count);
				});
			});
		} else {
			data.production.forEach((item) => {
				if (currProduction > 0 && item.production_id !== currProduction) {
					return;
				}
				item.data.forEach((item) => {
					sum += item.count;
					cnt += 1;
				});
			});
		}

		min = min === -1 ? 0 : min;
		max = max === -1 ? 0 : max;
		sum = sum === 0 ? 0 : sum;
		cnt = cnt === 0 ? 1 : cnt;

		/**
		 * 
		 * "sum_company": 17,
    "min_company": 1,
    "max_company": 8,
    "average_company": 4.25,
		 * 
		 */
		return type === "min"
			? data.min_company
			: type === "max"
				? data.max_company
				: type === "avg"
					? Math.round(data.average_company * 1)
					: data.sum_company;
	}, [type, data, production_id]);

	console.log(data);

	return (
		<Widget
			loading={isLoading}
			{...props}
			expanded={false}
			title={
				title ? title : type === "sum" ? "Итого по сериям" : "Cумма всех серий"
			}
			subTitle={
				type === "sum"
					? "Сумма за период"
					: type === "avg"
						? "Среднее значение"
						: type === "min"
							? "Минимальное значение"
							: "Максимальное значение"
			}
		>
			<Text c="red">{error?.message}</Text>
			<Text fz="3rem" ta="right">
				<NumberFormatter value={value} thousandSeparator=" " />
			</Text>
		</Widget>
	);
};

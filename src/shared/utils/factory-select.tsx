import {
	Loader,
	Select,
	type ComboboxItem,
	type SelectProps,
} from "@mantine/core";
import { useEffect, useMemo } from "react";

export interface factorySelectProps {
	isLoading: boolean;
	dataSelect: ComboboxItem[];
	load?: (...args: unknown[]) => Promise<void>;
}

export interface SelectCustomProps extends SelectProps {
	excludeds?: string[];
	includes?: string[];
}

/**
 * TODO:
 * - проверить dataSelect, обрезаятся повторные значения для ComboboxItem надо глянуть для string
 */

export function factorySelect(
	props: factorySelectProps | ((...args: unknown[]) => factorySelectProps),
	...params: unknown[]
): (props: SelectCustomProps) => React.ReactNode {
	return ({
		leftSection,
		disabled,
		excludeds,
		includes,
		...other
	}: SelectCustomProps = {}) => {
		const store = typeof props === "function" ? props(...params) : props;

		const dataSelect = useMemo(() => {
			let set = [...new Set(store.dataSelect.map((item) => item.value))];
			let dataSelect: ComboboxItem[] = set.map((id) => {
				let label = store.dataSelect
					.filter((item) => item.value == id)
					.map((item) => item.label)
					.join(", ");
				return {
					value: id,
					label,
				};
			});

			if (includes?.length) {
				dataSelect = dataSelect.filter((item: ComboboxItem | string) =>
					includes.includes(item?.value || item),
				);
			}

			if (excludeds?.length) {
				dataSelect = dataSelect.filter(
					(item: ComboboxItem | string) =>
						!excludeds.includes(item.value || item),
				);
			}
			return dataSelect;
		}, [store.dataSelect, includes, excludeds]);

		useEffect(() => {
			store?.load?.();
		}, []);

		return (
			<Select
				allowDeselect={false}
				disabled={store.isLoading || disabled}
				leftSection={store.isLoading ? <Loader size="xs" /> : leftSection}
				data={dataSelect}
				searchable
				{...other}
			/>
		);
	};
}

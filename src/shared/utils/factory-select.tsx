import {
	Loader,
	Select,
	type ComboboxItem,
	type SelectProps,
} from "@mantine/core";
import { useEffect, useMemo } from "react";

interface Props {
	isLoading: boolean;
	dataSelect: ComboboxItem[];
	load?: (...args: unknown[]) => Promise<void>;
}

export interface SelectCustomProps extends SelectProps {
	excludeds?: string[];
	includes?: string[];
}

export function factorySelect(
	props: Props | ((...args: unknown[]) => Props),
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
			let dataSelect = store.dataSelect;
			if (includes?.length) {
				dataSelect = dataSelect.filter((item: ComboboxItem | string) =>
					includes.includes(item.value || item),
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
				disabled={store.isLoading || disabled}
				leftSection={store.isLoading ? <Loader size="xs" /> : leftSection}
				data={dataSelect}
				searchable
				{...other}
			/>
		);
	};
}

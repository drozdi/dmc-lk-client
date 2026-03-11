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
}

export function factorySelect(
	props: Props | ((...args: unknown[]) => Props),
	...params: unknown[]
): (props: SelectCustomProps) => React.ReactNode {
	return ({
		leftSection,
		disabled,
		excludeds,
		...other
	}: SelectCustomProps = {}) => {
		const store = typeof props === "function" ? props(...params) : props;

		const dataSelect = useMemo(() => {
			if (excludeds?.length) {
				return store.dataSelect.filter(
					(item: ComboboxItem | string) =>
						!excludeds.includes(item.value || item),
				);
			}
			return store.dataSelect;
		}, [store.dataSelect, excludeds]);

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

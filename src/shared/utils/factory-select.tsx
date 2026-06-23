import {
	Loader,
	MultiSelect,
	Select,
	type ComboboxItem,
	type MultiSelectProps,
	type SelectProps,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { SELECT_ALL_VALUE } from "../";

export interface factorySelectProps {
	isLoading: boolean;
	dataSelect: ComboboxItem[];
	load?: (...args: unknown[]) => Promise<void>;
}

export interface SelectCustomProps extends SelectProps {
	excludeds?: string[];
	includes?: string[];
}

export interface SelectMultiCustomProps extends MultiSelectProps {
	excludeds?: string[];
	includes?: string[];
	allLabel?: string;
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


export function factoryMultipleSelect(
	props: factorySelectProps | ((...args: unknown[]) => factorySelectProps),
	...params: unknown[]
): (props: SelectMultiCustomProps) => React.ReactNode {
	return ({
		leftSection,
		disabled,
		excludeds,
		includes,
		allLabel = 'Выбрать всех',
		onChange,
		defaultValue,
		value,
		...other
	}: SelectMultiCustomProps = {}) => {
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

		const dataWithSelectAll = [
			{ value: SELECT_ALL_VALUE, label: allLabel },
			...dataSelect,
		];

		const [selectedValues, setSelectedValues] = useState<string[]>(value || defaultValue);

		const handleChange = (values: string[]) => {
			// Если в значениях появился наш специальный пункт
			if (values.includes(SELECT_ALL_VALUE)) {
				// Убираем его из массива (он не должен храниться)
				const newValues = values.filter(v => v !== SELECT_ALL_VALUE);

				// Если после фильтрации выбраны все исходные опции → снимаем все (toggle)
				const allOriginalValues = dataSelect.map(opt => opt.value);
				const isAllSelected = allOriginalValues.every(v => newValues.includes(v));

				if (isAllSelected) {
					setSelectedValues([]);
				} else {
					setSelectedValues(allOriginalValues);
				}
				return;
			}

			// Обычный случай — просто сохраняем выбранные значения
			setSelectedValues(values);
		};

		useEffect(() => {
			onChange?.(selectedValues);
		}, [onChange, selectedValues])

		return (
			<MultiSelect
				disabled={store.isLoading || disabled}
				leftSection={store.isLoading ? <Loader size="xs" /> : leftSection}
				data={dataWithSelectAll}
				searchable
				defaultValue={defaultValue}
				{...other}
				value={selectedValues}
				onChange={handleChange}
			/>
		);
	};
}
import {
	Group,
	Popover,
	SegmentedControl,
	Select,
	Text,
	Tooltip,
	type ComboboxItem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { cloneElement, useEffect, useMemo, useState } from "react";
import { TbInfoCircle } from "react-icons/tb";
import { type StoreApi, type UseBoundStore } from "zustand";

export interface FieldWrapProps {
	store: UseBoundStore<StoreApi<WidgetContextType>>;
	type: string;
	children: React.ReactNode;
	label?: string;
	description?: string;
	required?: boolean;
	value?: any;
	defaultValue?: any;
	onChange?: (value: any) => void;
}

export function FieldWrap({
	type,
	store: useStore,
	children,
	label,
	description,
	required,
	value,
	defaultValue,
	onChange,
}: FieldWrapProps) {
	const store = useStore();
	const v = useMemo(() => value || defaultValue, [value, defaultValue]);
	const [mode, setMode] = useState<"field" | "select">(
		typeof v === "string" && v.startsWith("$") ? "select" : "field",
	);
	const [opened, { open, close }] = useDisclosure(false);

	const varibles = useMemo(() => {
		return Object.fromEntries(
			Object.entries(store.varibles).filter(
				([key, field]) => field.type === type,
			),
		);
	}, [type, store.varibles]);

	const isMakeVarible = useMemo<boolean>(
		() => Object.values(varibles).length > 0,
		[varibles],
	);

	useEffect(() => {
		setMode(typeof v === "string" && v.startsWith("$") ? "select" : "field");
	}, [v]);

	return (
		<Group justify="space-between" align="flex-start">
			{(label || description) && (
				<Group flex={1} justify="space-between">
					{label && (
						<Text flex={1}>
							{label}
							{required && (
								<span
									style={{
										color: "red",
									}}
									aria-hidden
								>
									{" *"}
								</span>
							)}
						</Text>
					)}
					{description && (
						<Tooltip label={description}>
							<TbInfoCircle />
						</Tooltip>
					)}
				</Group>
			)}
			<Popover
				disabled={!isMakeVarible}
				opened={opened}
				position="right"
				withArrow
			>
				<Popover.Target>
					{mode === "field" ? (
						cloneElement(children as any, {
							flex: 1,
							onMouseEnter: open,
							onMouseLeave: close,
						})
					) : (
						<Select
							flex={1}
							value={value}
							defaultValue={defaultValue}
							data={
								Object.entries(varibles).map(([value, { label }]) => ({
									value,
									label,
								})) as ComboboxItem[]
							}
							onChange={(value) => onChange?.(value)}
							onMouseEnter={open}
							onMouseLeave={close}
						/>
					)}
				</Popover.Target>
				<Popover.Dropdown onMouseEnter={open} onMouseLeave={close}>
					<SegmentedControl
						orientation="vertical"
						defaultValue={mode}
						data={[
							{
								label: "Выбрать из списка",
								value: "select",
							},
							{
								label: "Ввести вручную",
								value: "field",
							},
						]}
						onChange={(val) => {
							onChange?.("");
							setMode(val as any);
						}}
					/>
				</Popover.Dropdown>
			</Popover>
		</Group>
	);
}

import { useDashboard } from "@/entites/dashboard";
import {
	Group,
	HoverCard,
	SegmentedControl,
	Select,
	Text,
	Tooltip,
	type ComboboxItem,
} from "@mantine/core";
import { cloneElement, useEffect, useMemo, useState } from "react";
import { TbInfoCircle } from "react-icons/tb";

export interface FieldWrapProps {
	type: string;
	children: React.ReactNode;
	label?: string;
	description?: string;
	required?: boolean;
	value?: any;
	defaultValue?: any;
	onChange?: (value: any) => void;
	error?: React.ReactNode
}

export function FieldWrap(props: FieldWrapProps) {
	const {
		type,
		children,
		label,
		description,
		required,
		value,
		defaultValue,
		onChange,
		error
	} = props;

	const store = useDashboard();
	const v = useMemo(() => value || defaultValue, [value, defaultValue]);
	const [mode, setMode] = useState<"field" | "select">(
		typeof v === "string" && v.startsWith("$") ? "select" : "field",
	);
	const varibles = useMemo<ComboboxItem[]>(() => {
		return Object.entries(store.varibles).filter(
			([key, field]) => field.type === type,
		).map(([value, { label }]) => ({
			value,
			label,
		})) as ComboboxItem[];
	}, [type, store.varibles]);

	const isMakeVarible = useMemo<boolean>(
		() => varibles.length > 0,
		[varibles],
	);

	useEffect(() => {
		setMode(typeof v === "string" && v.startsWith("$") ? "select" : "field");
	}, [v]);

	return (
		<Group justify="space-between" align="flex-start" grow wrap="nowrap">
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
			<HoverCard disabled={!isMakeVarible} position="right" withArrow>
				<HoverCard.Target>
					{mode === "field" ? (
						cloneElement(children as any, {
							flex: 1,
						})
					) : (
						<Select
							allowDeselect={!required}
							flex={1}
							required={required}
							value={value}
							defaultValue={defaultValue}
							data={varibles}
							placeholder="Выберите переменую"
							onChange={(value) => onChange?.(value)}
							error={error}
						/>
					)}
				</HoverCard.Target>
				<HoverCard.Dropdown>
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
							//onChange?.(varibles[0]?.value);
							setMode(val as any);
						}}
					/>
				</HoverCard.Dropdown>
			</HoverCard>
		</Group>
	);
}

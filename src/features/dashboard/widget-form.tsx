import {
	Button,
	Checkbox,
	Group,
	Select,
	Stack,
	Text,
	type ComboboxItem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { TbPlus } from "react-icons/tb";
import { type StoreApi, type UseBoundStore } from "zustand";
import { FieldNumber } from "./components/field-number";
import { FieldString } from "./components/field-string";
import { FieldText } from "./components/field-text";
import { FieldWrap } from "./components/field-wrarp";

interface WidgetFormProps {
	store: UseBoundStore<StoreApi<DashboardContextType>>;
	onAdd?: (widget: IWidget) => void;
}

export function WidgetForm({ store: useStore, onAdd }: WidgetFormProps) {
	const store = useStore();
	const { availableWidgets } = store;
	const [params, setParams] = useState<IWidgetParam[]>([]);

	const form = useForm<Partial<IWidgetItem>>({
		mode: "uncontrolled",
		initialValues: {
			type: Object.values(availableWidgets)[0]?.type || "",
			fixed: true,
			params: {},
		},
	});
	form.watch("type", ({ value }) => {
		setParams(availableWidgets[value]?.params || []);
	});

	useEffect(() => {
		form.initialize({
			type: Object.values(availableWidgets)[0].type || "",
			fixed: true,
		});
		setParams(availableWidgets[form.values.type].params || []);
	}, []);

	function handleAdd(widget: IWidget) {
		store.addWidget(widget);
		onAdd?.(widget);
	}

	return (
		<>
			<Stack gap="xs">
				<Text fz="xl">Добавить виджет</Text>
				<Checkbox
					label="Зафиксировать"
					key={form.key("fixed")}
					{...form.getInputProps("fixed", { type: "checkbox" })}
				/>
				<Select
					placeholder="Выбрать виджет"
					comboboxProps={{ withinPortal: false }}
					data={
						Object.entries(availableWidgets).map(
							([type, { label }]: [string, IWidget]) => ({
								value: type,
								label,
							}),
						) as ComboboxItem[]
					}
					key={form.key("type")}
					{...form.getInputProps("type")}
				/>

				{params.map(({ label, description, field, type, ...param }) => (
					<FieldWrap
						key={field}
						label={label}
						description={description}
						required={param.required}
					>
						{type === "number" ? (
							<FieldNumber
								key={form.key(`param.${field}`)}
								{...form.getInputProps(`params.${field}`, param)}
							/>
						) : type === "text" ? (
							<FieldText
								key={form.key(`param.${field}`)}
								{...form.getInputProps(`params.${field}`, param)}
							/>
						) : (
							<FieldString
								key={form.key(`param.${field}`)}
								{...form.getInputProps(`params.${field}`, param)}
							/>
						)}
					</FieldWrap>
				))}
			</Stack>
			<Group mt="xs" justify="flex-end">
				<Button
					rightSection={<TbPlus />}
					onClick={() => form.onSubmit(handleAdd)()}
				>
					Добавить
				</Button>
			</Group>
		</>
	);
}

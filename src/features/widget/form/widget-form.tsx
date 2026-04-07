import { FactoryWidget } from "@/entites/widget/utils";
import { Button, Checkbox, Group, Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { TbPlus } from "react-icons/tb";
import { type StoreApi, type UseBoundStore } from "zustand";
import {
	FieldDate,
	FieldNumber,
	FieldSelect,
	FieldString,
	FieldText,
} from "./components";

interface WidgetFormProps {
	store: UseBoundStore<StoreApi<WidgetContextType>>;
	id?: IWidgetItem["id"];
	onSave?: (widget: IWidgetItem) => void;
	layout?: Partial<ILabelItem>;
}

export function WidgetForm({
	store: useStore,
	id,
	onSave,
	layout = {},
}: WidgetFormProps) {
	const store = useStore();
	const { availableWidgets } = store;
	const [params, setParams] = useState<IWidgetParam[]>([]);

	const form = useForm<Partial<IWidgetItem>>({
		mode: "uncontrolled",
		initialValues: {
			type: availableWidgets[0] || "",
			fixed: false,
			params: {},
		},
	});
	form.watch("type", ({ value }) => {
		setParams(FactoryWidget.getWidget(value)?.params || []);
	});

	useEffect(() => {
		const widget = store.findWidget(id);
		if (widget?.id) {
			form.setValues(widget);
		}
		setParams(FactoryWidget.getWidget(form.values.type || "")?.params || []);
	}, [id]);

	function handleAdd(widget: IWidgetItem) {
		if (id) {
			store.updateWidget(widget);
		} else {
			store.addWidget(widget, layout);
		}
		store.clear();
		onSave?.(widget);
	}

	console.log(id);

	return (
		<>
			<Stack gap="xs">
				<Checkbox
					label="Зафиксировать"
					key={form.key("fixed")}
					{...form.getInputProps("fixed", { type: "checkbox" })}
				/>
				<Select
					placeholder="Выбрать виджет"
					comboboxProps={{ withinPortal: false }}
					data={availableWidgets.map((type) => ({
						value: type,
						label: FactoryWidget.getWidget(type)?.label || type,
					}))}
					readOnly={id}
					key={form.key("type")}
					{...form.getInputProps("type")}
				/>

				{params.map(({ field, type, ...param }) =>
					type === "date" || type === "range:date" ? (
						<FieldDate
							type={type}
							store={useStore}
							{...param}
							key={form.key(`params.${field}`)}
							{...form.getInputProps(`params.${field}`, param)}
						/>
					) : type === "number" ? (
						<FieldNumber
							type={type}
							store={useStore}
							{...param}
							key={form.key(`params.${field}`)}
							{...form.getInputProps(`params.${field}`, param)}
						/>
					) : type === "text" ? (
						<FieldText
							type={type}
							store={useStore}
							{...param}
							key={form.key(`params.${field}`)}
							{...form.getInputProps(`params.${field}`, param)}
						/>
					) : type === "select" ? (
						<FieldSelect
							type={type}
							store={useStore}
							{...param}
							key={form.key(`params.${field}`)}
							{...form.getInputProps(`params.${field}`, param)}
						/>
					) : (
						<FieldString
							type={type as string}
							store={useStore}
							{...param}
							key={form.key(`params.${field}`)}
							{...form.getInputProps(`params.${field}`, param)}
						/>
					),
				)}
			</Stack>
			<Group mt="xs" justify="flex-end">
				<Button
					rightSection={<TbPlus />}
					onClick={() => form.onSubmit(handleAdd)()}
				>
					{id ? "Изменить" : "Добавить"}
				</Button>
			</Group>
		</>
	);
}

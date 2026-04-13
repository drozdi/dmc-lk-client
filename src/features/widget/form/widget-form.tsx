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
	layout?: Partial<ILayoutItem>;
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
	});
	form.watch("type", ({ value }) => {
		form.setFieldValue("params", {});
		setParams(FactoryWidget.getWidget(value)?.params || []);
	});

	useEffect(() => {
		const widget = store.findWidget(id);

		if (widget?.id) {
			form.initialize(widget);
			form.setInitialValues(widget);
			form.setValues(widget);
		} else {
			const params = {};

			form.initialize({
				type: availableWidgets[0] || "",
				fixed: false,
				params,
			});
			form.setInitialValues({
				type: availableWidgets[0] || "",
				fixed: false,
				params,
			});
			form.setValues({
				type: availableWidgets[0] || "",
				fixed: false,
				params,
			});
		}
	}, [id]);

	function handleAdd(widget: Partial<IWidgetItem>) {
		if (id) {
			store.updateWidget(widget as IWidgetItem);
		} else {
			store.addWidget(widget as IWidgetItem, layout);
		}
		store.clear();
		onSave?.(widget as IWidgetItem);
	}

	return (
		<>
			<Stack gap="xs">
				<Checkbox
					label="Зафиксировать"
					key={form.key("fixed")}
					{...form.getInputProps("fixed", { type: "checkbox" })}
				/>
				<Select
					allowDeselect={false}
					placeholder="Выбрать виджет"
					comboboxProps={{ withinPortal: false }}
					data={availableWidgets.map((type) => ({
						value: type,
						label: FactoryWidget.getWidget(type)?.label || type,
					}))}
					key={form.key("type")}
					{...form.getInputProps("type")}
				/>

				{params.map(({ field, type, default: def, ...param }) =>
					type === "date" || type === "range:date" ? (
						<FieldDate
							type={type}
							store={useStore}
							{...param}
							key={form.key(`params.${field}`)}
							{...form.getInputProps(`params.${field}`, param)}
							defaultValue={def}
						/>
					) : type === "number" ? (
						<FieldNumber
							type={type}
							store={useStore}
							{...param}
							key={form.key(`params.${field}`)}
							{...form.getInputProps(`params.${field}`, param)}
							defaultValue={def}
						/>
					) : type === "text" ? (
						<FieldText
							type={type}
							store={useStore}
							{...param}
							key={form.key(`params.${field}`)}
							{...form.getInputProps(`params.${field}`, param)}
							defaultValue={def}
						/>
					) : type === "select" ? (
						<FieldSelect
							allowDeselect={false}
							type={type}
							store={useStore}
							{...param}
							key={form.key(`params.${field}`)}
							{...form.getInputProps(`params.${field}`, param)}
							defaultValue={def}
						/>
					) : (
						<FieldString
							type={type as string}
							store={useStore}
							{...param}
							key={form.key(`params.${field}`)}
							{...form.getInputProps(`params.${field}`, param)}
							defaultValue={def}
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

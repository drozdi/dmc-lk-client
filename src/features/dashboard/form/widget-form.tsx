import { useDashboard } from "@/entites/dashboard";
import { FactoryWidget } from "@/entites/dashboard/utils";
import { Button, Checkbox, Group, Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { TbPlus } from "react-icons/tb";
import {
	FieldCheckbox,
	FieldDate,
	FieldNumber,
	FieldSelect,
	FieldSelectArray,
	FieldString,
	FieldText,
} from "./components";

export interface WidgetFormProps {
	id?: IWidgetItem["id"];
	onSave?: (widget: IWidgetItem) => void;
	layout?: Partial<ILayoutItem>;
}

export function WidgetForm({
	id,
	onSave,
	layout = {},
}: WidgetFormProps) {
	const store = useDashboard();
	const { availableWidgets } = store;
	const [params, setParams] = useState<IWidgetParam[]>([]);

	const form = useForm<Partial<IWidgetItem>>({
		mode: "uncontrolled",
	});

	form.watch("type", ({ value }) => {
		const params = FactoryWidget.getWidget(value)?.params
		const paramsDefault = {};
		for (const item of params) {
			if (item.defaultValue === undefined || item.defaultValue === null) {
				continue
			}
			paramsDefault[item.field] = item.defaultValue
		}
		form.setFieldValue("params", paramsDefault);
		setParams(params);
	});

	useEffect(() => {
		const widget = store.findWidget(id);
		if (widget?.id) {
			form.initialize(widget);
			form.setInitialValues(widget);
			form.setValues(widget);
		} else {
			const paramsDefault = {};
			for (const item of params) {
				if (item.defaultValue === undefined || item.defaultValue === null) {
					continue
				}
				paramsDefault[item.field] = item.defaultValue
			}

			form.initialize({
				type: availableWidgets[0] || "",
				fixed: false,
				params: paramsDefault,
			});
			form.setInitialValues({
				type: availableWidgets[0] || "",
				fixed: false,
				params: paramsDefault,
			});
			form.setValues({
				type: availableWidgets[0] || "",
				fixed: false,
				params: paramsDefault,
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

	console.log(form.values)

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

				{params.map(({ field, type, ...param }) => {
					return type === "date" || type === "date:range" ? (
						<FieldDate
							type={type}
							{...param}
							key={form.key(`params.${field}`)}
							{...form.getInputProps(`params.${field}`, param)}
						/>
					) : type === "select:array" ? (
						<FieldSelectArray
							type={type}
							{...param}
							key={form.key(`params.${field}`)}
							{...form.getInputProps(`params.${field}`, param)}
						/>
					) : type === "number" ? (
						<FieldNumber
							type={type}
							{...param}
							key={form.key(`params.${field}`)}
							{...form.getInputProps(`params.${field}`, param)}
						/>
					) : type === "text" ? (
						<FieldText
							type={type}
							{...param}
							key={form.key(`params.${field}`)}
							{...form.getInputProps(`params.${field}`, param)}
						/>
					) : type === "select" ? (
						<FieldSelect
							allowDeselect={false}
							type={type}
							{...param}
							key={form.key(`params.${field}`)}
							{...form.getInputProps(`params.${field}`, param)}
						/>
					) : type === "checkbox" ? (
						<FieldCheckbox
							type={type}
							{...param}
							key={form.key(`params.${field}`)}
							{...form.getInputProps(`params.${field}`, param)}
						/>
					) : (
						<FieldString
							type={type as string}
							{...param}
							key={form.key(`params.${field}`)}
							{...form.getInputProps(`params.${field}`, param)}
						/>
					)
				}
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

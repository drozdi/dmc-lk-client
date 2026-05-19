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
	onSave?: (widget: IWidgetItem) => void;
	dashboard?: WidgetContextType
}

export function WidgetForm({
	onSave,
	dashboard = useDashboard()
}: WidgetFormProps) {
	const { availableWidgets, id, preview } = dashboard;
	const form = useForm<Partial<IWidgetItem>>({
		mode: "uncontrolled",
		initialValues: {
			id: '',
			type: availableWidgets[0] || "",
			fixed: false,
			params: {}
		},
		validate: function (values) {
			const ret: Record<string, any> = {}
			if (values.type === "") {
				ret.type = "Выберите виджет"
			}
			for (const param of params) {
				ret[`params.${param.field}`] = param.validate?.(values.params[param.field]) || param.required && values.params[param.field] === undefined ? param.label + " обязательный параметр" : null
			}
			console.log(ret)
			return ret
		}
	});
	const [params, setParams] = useState<IWidgetParam[]>(FactoryWidget.getWidget(form.values.type as string)?.params || [])

	form.watch("type", ({ value }) => {
		const params = FactoryWidget.getWidget(value as string)?.params || []
		form.setFieldValue("params", params.reduce<Record<string, any>>((acc, { field, defaultValue }) => {
			if (defaultValue !== undefined && defaultValue !== null) {
				acc[field] = defaultValue;
			}
			return acc;
		}, {}));
		setParams(params)
	});

	useEffect(() => {
		const widget = dashboard.findWidget(id);
		if (widget?.id) {
			form.setValues(widget);
			form.setFieldValue("params", widget.params)
		} 
	}, [id]);

	function handleAdd(widget: Partial<IWidgetItem>) {
		if (id) {
			dashboard.updateWidget(widget as IWidgetItem);
		} else {
			dashboard.addWidget(widget as IWidgetItem, preview);
		}
		dashboard.clear();
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
				<Group justify="flex-end">
					<Button
						rightSection={<TbPlus />}
						onClick={() => form.onSubmit(handleAdd)()}
					>
						{id ? "Изменить" : "Добавить"}
					</Button>
				</Group>
			</Stack>
			
		</>
	);
}

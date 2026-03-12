import { FactoryWidget } from "@/entites/widget/utils";
import { Button, Checkbox, Group, Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { TbPlus } from "react-icons/tb";
import { type StoreApi, type UseBoundStore } from "zustand";
import { FieldNumber } from "./components/field-number";
import { FieldString } from "./components/field-string";
import { FieldText } from "./components/field-text";
import { FieldWrap } from "./components/field-wrarp";

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
		form.initialize({
			type: store.findWidget(id)?.type || availableWidgets[0],
			fixed: false,
		});
		setParams(FactoryWidget.getWidget(form.values.type || "")?.params || []);
	}, [id]);

	function handleAdd(widget: IWidgetItem) {
		store.addWidget(widget, layout);
		store.clear();
		onSave?.(widget);
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
					placeholder="Выбрать виджет"
					comboboxProps={{ withinPortal: false }}
					data={availableWidgets.map((type) => ({
						value: type,
						label: FactoryWidget.getWidget(type).label,
					}))}
					readOnly={id}
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

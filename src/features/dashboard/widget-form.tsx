import { FactoryWidget } from "@/entites/dashboard/utils";
import { Button, Checkbox, Group, Select, Stack, Text } from "@mantine/core";
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
	id?: IWidgetItem["id"];
	onAdd?: (widget: IWidgetItem) => void;
}

export function WidgetForm({ store: useStore, id, onAdd }: WidgetFormProps) {
	const store = useStore();
	const { availableWidgets } = store;
	const [params, setParams] = useState<IWidgetParam[]>([]);

	const form = useForm<Partial<IWidgetItem>>({
		mode: "uncontrolled",
		initialValues: {
			type: availableWidgets[0] || "",
			fixed: true,
			params: {},
		},
	});
	form.watch("type", ({ value }) => {
		setParams(FactoryWidget.getWidget(value)?.params || []);
	});

	useEffect(() => {
		form.initialize({
			type: store.findWidget(id)?.type || availableWidgets[0],
			fixed: true,
		});
		setParams(FactoryWidget.getWidget(form.values.type || "")?.params || []);
	}, [id]);

	function handleAdd(widget: IWidgetItem) {
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
					data={availableWidgets.map((type) => ({
						value: type,
						label: FactoryWidget.getWidget(type).label,
					}))}
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

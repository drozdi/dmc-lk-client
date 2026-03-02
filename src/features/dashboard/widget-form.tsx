import { Button, Group, Select, Stack, type ComboboxItem } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { TbPlus } from "react-icons/tb";
import { type StoreApi, type UseBoundStore } from "zustand";
import { FieldNumber } from "./components/field-number";
import { FieldString } from "./components/field-string";
import { FieldText } from "./components/field-text";
import { FieldWrap } from "./components/field-wrarp";

interface WidgetFormProps {
	store: UseBoundStore<StoreApi<DashboardContextType>>;
}

export function WidgetForm({ store: useStore }: WidgetFormProps) {
	const store = useStore();
	const { availableWidgets } = store;
	const [widget, updateWidget] = useSetState<IWidget>({
		type: Object.values(availableWidgets)[0]?.type || "",
		params: {},
	});
	const params = availableWidgets[widget.type]?.params as IWidgetParam[];
	function handleAdd() {
		store.addWidget(widget);
		updateWidget({
			type: Object.values(availableWidgets)[0]?.type || "",
			params: {},
		});
	}
	return (
		<>
			<Stack gap="xs">
				<Select
					label="Добавить виджет"
					placeholder="Select widget"
					value={widget.type}
					data={
						Object.entries(availableWidgets).map(
							([type, { label }]: [string, IWidget]) => ({
								value: type,
								label,
							}),
						) as ComboboxItem[]
					}
					onChange={(value) =>
						updateWidget({
							type: value,
							params: {},
						})
					}
				/>
				{params.map((param) => (
					<FieldWrap
						label={param.label}
						description={param.description}
					>
						{param.type === "number" ? (
							<FieldNumber
								onChange={(value) => {
									updateWidget({
										params: {
											...widget.params,
											[param.field]: value,
										},
									});
								}}
							/>
						) : param.type === "text" ? (
							<FieldText
								onChange={(value) => {
									updateWidget({
										params: {
											...widget.params,
											[param.field]: value,
										},
									});
								}}
							/>
						) : (
							<FieldString
								onChange={(value) => {
									updateWidget({
										params: {
											...widget.params,
											[param.field]: value,
										},
									});
								}}
							/>
						)}
					</FieldWrap>
				))}
			</Stack>
			<Group mt="xs" justify="flex-end">
				<Button rightSection={<TbPlus />} onClick={handleAdd}>
					Добавить
				</Button>
			</Group>
		</>
	);
}

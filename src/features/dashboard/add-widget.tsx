import {
	ActionIcon,
	Button,
	Group,
	Popover,
	Select,
	TextInput,
} from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { TbPlus, TbSettings } from "react-icons/tb";
import { type StoreApi, type UseBoundStore } from "zustand";

interface AddWidgetProps {
	store: UseBoundStore<StoreApi<DashboardContextType>>;
}

export function AddWidget({ store: useStore }: AddWidgetProps) {
	const store = useStore();
	const { availableWidgets } = store;
	const [widget, updateWidget] = useSetState<IWidget>({
		type: Object.entries(availableWidgets)[0][0],
		params: {},
	});
	const params = availableWidgets[widget.type].params;
	function handleAdd() {
		store.addWidget(widget);
		updateWidget({
			type: Object.entries(availableWidgets)[0][0],
			params: {},
		});
	}

	return (
		<Popover>
			<Popover.Target>
				<ActionIcon variant="outline">
					<TbSettings />
				</ActionIcon>
			</Popover.Target>
			<Popover.Dropdown>
				<Select
					label="Add widget"
					placeholder="Select widget"
					value={widget.type}
					data={Object.entries(availableWidgets).map(
						([type, { label }]) => ({
							value: type,
							label,
						}),
					)}
					onChange={(value) =>
						updateWidget({
							type: value,
							params: {},
						})
					}
				/>
				{params.map((param) => (
					<TextInput
						label={param.label}
						onChange={({ target }) => {
							updateWidget({
								params: {
									...widget.params,
									[param.field]: target.value,
								},
							});
						}}
					/>
				))}
				<Group mt="xs" justify="flex-end">
					<Button rightSection={<TbPlus />} onClick={handleAdd}>
						Добавить
					</Button>
				</Group>
			</Popover.Dropdown>
		</Popover>
	);
}

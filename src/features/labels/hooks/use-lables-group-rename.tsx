import {
	useStoreLabels
} from "@/entites/labels";
import {
	Button,
	Group,
	Stack,
	TextInput
} from "@mantine/core";
import { modals } from "@mantine/modals";

export function useLabelsGroupRename (item?: ILabel): void {
	if (!item) {
		return
	}

	const storeLabels = useStoreLabels.getState();

	const {
		production_id,
		add_label_format,
		statistics_print_format
	} = item;

	const inputRef:React.Ref<HTMLInputElement> = {
		current: null
	}

	async function handleRename (newFormat = inputRef?.current?.value) {
		if (add_label_format === newFormat) {
			modals.close(modal)
			return
		}

		await storeLabels.updateFormat(item?.id, {
			production_id,
			add_label_format: newFormat
		})

		modals.close(modal)
	}

	const modal = modals.open({
		title: `Переименовать группу "${add_label_format} (${statistics_print_format})"`,
		children: <Stack>
			<TextInput defaultValue={add_label_format} ref={inputRef} />
			<Group justify="flex-end">
				<Button onClick={() => modals.close(modal)}>
					Отмена
				</Button>
				<Button color='lime' onClick={() => handleRename()}>
					Сохранить
				</Button>
			</Group>
		</Stack>,
		onEnterTransitionEnd: () => {
			inputRef.current?.focus();
		},
	})
};

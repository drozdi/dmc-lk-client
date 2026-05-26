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
import { useRef } from "react";

export interface useLabelsGroupRenameProps {
	id: ILabel['id'];
}

export const useLabelsGroupRename = ({ id = 0 }: useLabelsGroupRenameProps) => {
	if (!id) {
		return null;
	}

	const storeLabels = useStoreLabels();
	
	const item = storeLabels.formatPrints.find((item) => {
		return item.id === id
	})

	if (!item) {
		return null
	}

	const {
		production_id,
		add_label_format,
		statistics_print_format
	} = item;


	const inputRef = useRef<HTMLInputElement>(null);

	async function handleRename (newFormat = inputRef.current?.value) {
		if (add_label_format === newFormat) {
			modals.close(modal)
			return
		}

		await storeLabels.updateFormat(id, {
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

	return null;
};

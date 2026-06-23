import {
	useStoreLabels
} from "@/entites/labels";
import { modals } from "@mantine/modals";

export interface useLabelsGroupRemove {
	id: ILabel['id'];
}

export const useLabelsGroupRemove = ({ id = 0 }: useLabelsGroupRemove) => {
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


	modals.openConfirmModal({
		title: `Вы уверены? Что хотитее удалить "${add_label_format} (${statistics_print_format})"`,
		labels: { confirm: "Удалить", cancel: "Нет" },
		onConfirm: async () => {
			await storeLabels.deleteFormat({
				format: add_label_format,
				production_id: production_id,
			})
		},
		confirmProps: {
			variant: "filled",
			color: "red",
		},
		cancelProps: {
			variant: "filled",
		},
	});

	return null;
};

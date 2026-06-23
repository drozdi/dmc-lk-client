import {
	useDashboard
} from "@/entites/dashboard";
import { WidgetForm } from "@/features/dashboard/form/widget-form";
import { Modal } from "@mantine/core";

export interface ModalFormProps {
	dashboard?: WidgetContextType
	onClose?: () => void;
}

export function ModalForm ({
	dashboard = useDashboard(),
	onClose
}: ModalFormProps) {
	const opened = dashboard.preview || dashboard.id;

	return <Modal
		title="Настройка виджета"
		opened={opened}
		keepMounted={false}
		onClose={() => {
			dashboard.clear();
			onClose?.()
		}}
	>
		{opened && (
			<WidgetForm
				dashboard={dashboard}
				onSave={() => {
					dashboard.clear();
					onClose?.();
				}}
			/>
		)}
	</Modal>
}
import {
	useDashboard
} from "@/entites/dashboard";
import { WidgetForm } from "@/features/dashboard/form/widget-form";
import { Modal } from "@mantine/core";

export interface ModalFormProps {
	opened: boolean;
	onClose?: () => void;
}

export function ModalForm ({
	opened,
	onClose
}: ModalFormProps) {
		const dashboard = useDashboard();
		return <Modal
			title="Настройка виджета"
			opened={opened}
			keepMounted={false}
			onClose={onClose}
		>
			{opened && (
				<WidgetForm
					id={dashboard.id}
					onSave={() => {
						dashboard.clear();
						onClose?.();
					}}
					layout={layout}
				/>
			)}
		</Modal>
}
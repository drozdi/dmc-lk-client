import {
	closestCenter,
	DndContext,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent
} from '@dnd-kit/core';
import { useStoreLabels } from "../stores";

export interface GroupedProviderProps {
	children: React.ReactNode;
	production_id: ILabel["production_id"];
}

export function GroupedProvider({
	children,
	production_id,
}: GroupedProviderProps) {
	const storeLabels = useStoreLabels();
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5, // Элемент начнет перетаскивание только после смещения на 5px
			},
		}),
	);
	function handleDragEnd (event: DragEndEvent) {
		const print = event.active?.id as string;
		const newFormat = event.over?.id as string;
		const current = storeLabels.formatPrints.find((item) => 
			item.print === print && item.production_id === production_id
		)
		const oldFormat = current?.format || '.default';
		if (oldFormat === '.default' && newFormat !== '.default') {
			storeLabels.addFormatPrint({
				production_id,
				add_label_format: newFormat,
				statistics_print_format: print,
			})
		} else if (oldFormat !== newFormat && newFormat === '.default') {
			current && storeLabels.deleteFormatPrint(current)
		} else if (oldFormat !== newFormat) {
			storeLabels.updateFormatPrint(current?.id, {
				production_id,
				add_label_format: newFormat,
				statistics_print_format: print,
			})
		}
	}
	return <DndContext
		sensors={sensors}
		collisionDetection={closestCenter}
		onDragEnd={handleDragEnd}
	>
		{children}
	</DndContext>
}

import { $setting } from "@/shared";
import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface DashBoardProviderProps {
	children: React.ReactNode;
	name: string;
	items: any[];
}

export function DashBoardProvider({
	children,
	name,
	items,
}: DashBoardProviderProps) {
	const [widgets, setWidgets] = $setting.useState(`dashboard.${name}`, items);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (active.id !== over?.id) {
			console.log(active.id, over?.id);
			setWidgets((items) => {
				const oldIndex = items.findIndex(
					(item) => item.id === active.id,
				);
				const newIndex = items.findIndex(
					(item) => item.id === over?.id,
				);
				return arrayMove(items, oldIndex, newIndex);
			});
		}
	};
	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
			modifiers={[restrictToParentElement]}
		>
			<SortableContext
				items={widgets}
				strategy={verticalListSortingStrategy}
			>
				{children}
			</SortableContext>
		</DndContext>
	);
}

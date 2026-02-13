import { DragDropProvider } from "@dnd-kit/react";
import { useStoreLabels } from "../stores";
import { useGrouped } from "../stores/hooks";

export function GroupedProvider({
	children,
	production_id,
}: {
	children: React.ReactNode;
	production_id: ILabel["production_id"];
}) {
	const storeLabels = useStoreLabels();

	const containers = useGrouped(production_id);

	const findIndex = (item, id) =>
		item === id ||
		(typeof item === "object" && "id" in item && item.id === id);

	const handleDragEnd = async (event) => {
		const { source, target } = event.operation;

		let sourceIndex = -1;
		let sourceParent: string;
		let targetIndex = -1;
		let targetParent: string;

		for (const [id, children] of Object.entries(containers)) {
			if (sourceIndex === -1) {
				sourceIndex = children.findIndex((item) =>
					findIndex(item, source.id),
				);
				if (sourceIndex !== -1) {
					sourceParent = id;
				}
			}
			if (targetIndex === -1) {
				targetIndex = children.findIndex((item) =>
					findIndex(item, target.id),
				);
				if (targetIndex !== -1) {
					targetParent = id;
				}
			}
			if (sourceIndex !== -1 && targetIndex !== -1) {
				break;
			}
		}

		if (sourceIndex === -1 && targetIndex === -1) {
			return;
		}

		if (
			containers[sourceParent][sourceIndex]?._id &&
			target.id === ".default"
		) {
			await storeLabels.deleteFormatPrint({
				id: containers[sourceParent][sourceIndex]?._id,
			});
		} else if (
			sourceParent !== target.id &&
			containers[sourceParent][sourceIndex]._id
		) {
			storeLabels.updateFormatPrint(
				containers[sourceParent][sourceIndex]._id,
				{
					production_id,
					add_label_format: target.id,
					statistics_print_format:
						containers[sourceParent][sourceIndex].print,
				},
			);
		} else if (
			target.id !== ".default" &&
			!containers[sourceParent][sourceIndex]._id
		) {
			storeLabels.addFormatPrint({
				production_id,
				add_label_format: target.id,
				statistics_print_format:
					containers[sourceParent][sourceIndex].print,
			});
		}
	};

	return (
		<DragDropProvider onDragEnd={handleDragEnd}>
			{children}
		</DragDropProvider>
	);
}

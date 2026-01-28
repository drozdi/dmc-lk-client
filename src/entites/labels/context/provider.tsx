import { DragDropProvider } from "@dnd-kit/react";
import { useMemo } from "react";
import { useStoreLabels } from "../stores";

export function GroupedProvider({
	children,
	production_id,
}: {
	children: React.ReactNode;
	production_id: string | number;
}) {
	const storeLabels = useStoreLabels();

	const prints = useMemo(
		() => storeLabels.prints[String(production_id)] || [],
		[storeLabels.prints, production_id],
	);
	const formats = useMemo(
		() => storeLabels.formats[String(production_id)] || [],
		[storeLabels.formats, production_id],
	);
	const formatPrints = useMemo(
		() => storeLabels.formatPrints[String(production_id)] || [],
		[storeLabels.formatPrints, production_id],
	);

	const containers = useMemo<
		Record<
			string,
			{
				id: number | string;
				_id?: number;
				print: string;
				format: string;
			}[]
		>
	>(() => {
		const con: Record<
			string,
			{
				id: string;
				_id?: number;
				format: string;
				print: string;
			}[]
		> = Object.fromEntries((formats || []).map((item) => [item, []])) || {};

		con[".default"] = (prints || []).map((item) => ({
			id: item,
			_id: undefined,
			format: ".default",
			print: item,
		}));

		formatPrints.forEach((item) => {
			item.format &&
				con[item.format]?.push({
					id: item.statistics_print_format,
					_id: item.id,
					format: item.format,
					print: item.statistics_print_format,
				});
			const i = con[".default"]?.findIndex((e) => e.print === item.print);
			if (i !== -1) {
				con[".default"]?.splice(i, 1);
			}
		});

		return con;
	}, [formats, prints, formatPrints]);

	const findIndex = (item, id) =>
		item === id ||
		(typeof item === "object" && "id" in item && item.id === id);

	const handleDragEnd = async (event) => {
		const { source, target } = event.operation;

		let sourceIndex = -1;
		let sourceParent;
		let targetIndex = -1;
		let targetParent;

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
			containers[sourceParent][sourceIndex]._id &&
			target.id === ".default"
		) {
			await storeLabels.deleteFormatPrint(
				containers[sourceParent][sourceIndex]._id,
			);
			storeLabels.loadPrints(true);
			storeLabels.loadFormats(true);
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
				production_id: Number(production_id),
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

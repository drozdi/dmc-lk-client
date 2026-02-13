import { useMemo } from "react";
import { useFormatPrints } from "./use-format-prints";
import { useFormats } from "./use-formats";
import { usePrints } from "./use-prints";

export function useGrouped(production_id: ILabel["production_id"]) {
	const prints = usePrints(production_id);
	const formats = useFormats(production_id);
	const formatPrints = useFormatPrints(production_id);

	return useMemo<
		Record<
			ILabel["production_id"],
			{
				id: ILabel["statistics_print_format"];
				_id?: ILabel["id"];
				format: ILabel["add_label_format"];
				print: ILabel["statistics_print_format"];
			}[]
		>
	>(() => {
		const containers: Record<
			ILabel["production_id"] | ".default",
			{
				id: ILabel["statistics_print_format"];
				_id?: ILabel["id"];
				format: ILabel["add_label_format"] | ".default";
				print: ILabel["statistics_print_format"];
			}[]
		> = Object.fromEntries((formats || []).map((item) => [item, []])) || {};

		containers[".default"] = (prints || []).map((item) => ({
			id: item,
			_id: undefined,
			format: ".default",
			print: item,
		}));

		formatPrints.forEach((item) => {
			item.format &&
				containers[item.format]?.push({
					id: item.statistics_print_format,
					_id: item.id,
					format: item.add_label_format,
					print: item.statistics_print_format,
				});
			const i =
				containers[".default"]?.findIndex(
					(e) => e.print === item.print,
				) || -1;
			if (i > -1) {
				containers[".default"]?.splice(i, 1);
			}
		});

		return containers;
	}, [formats, prints, formatPrints]);
}

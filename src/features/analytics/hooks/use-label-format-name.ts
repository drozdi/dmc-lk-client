import { labelName } from "@/shared/utils";
import { useCallback, useState } from "react";

export function useLabelFormatName(initialFilterGap = true) {
	const [filterGap, setFilterGap] = useState(initialFilterGap);

	const formatName = useCallback(
		(name: string): string => {
			const normalized = (name || "")
				.toUpperCase()
				.replace(/\.[^A-Z^a-z]*/g, "");
			return filterGap ? labelName(normalized) : normalized;
		},
		[filterGap],
	);

	return { filterGap, setFilterGap, formatName };
}

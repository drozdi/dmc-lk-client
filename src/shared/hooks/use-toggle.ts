import { useCallback, useState } from "react";

export function useToggle(initial = false) {
	const [value, setValue] = useState<boolean>(initial);
	const toggle = useCallback(() => setValue((v) => !v), []);
	return [value, toggle];
}
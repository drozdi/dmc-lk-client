import { createContext, useContext, useMemo } from "react";

export interface WidgetContext {
	isExpanded: boolean;
}

const Context = createContext<WidgetContext | undefined>(undefined);

export function useWidget(): WidgetContext | undefined {
	return useContext(Context) || undefined;
}

export function ProviderWidget({
	children,
	isExpanded,
}: WidgetContext & {
	children: React.ReactNode;
}) {
	const value = useMemo(() => ({ isExpanded }), [isExpanded]);

	return <Context.Provider value={value}>{children}</Context.Provider>;
}

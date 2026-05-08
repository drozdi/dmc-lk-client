import { createContext, useContext } from "react";

export interface WidgetContext {
	isExpanded: boolean;
}

const Context = createContext<WidgetContext | undefined>(undefined);

export function useWidget(): WidgetContext | undefined {
	return useContext(Context) || undefined;
}

export function ProviderWidget({
	children,
	...props
}: WidgetContext & {
	children: React.ReactNode;
}) {
	return <Context.Provider value={props}>{children}</Context.Provider>;
}

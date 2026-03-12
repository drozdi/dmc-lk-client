import { createContext, useContext } from "react";
import { type StoreApi, type UseBoundStore, useStore } from "zustand";

interface WidgetsProviderProps {
	children: React.ReactNode;
	store: UseBoundStore<StoreApi<WidgetContextType>>;
}

const WidgetsContext = createContext<WidgetContextType | undefined>(undefined);

const WidgetItemContext = createContext<IWidgetItem | undefined>(undefined);

export const WidgetsProvider: React.FC<WidgetsProviderProps> = ({
	children,
	store,
}) => {
	return (
		<WidgetsContext.Provider value={useStore(store)}>
			{children}
		</WidgetsContext.Provider>
	);
};

export const WidgetItemProvider: React.FC<
	IWidgetItem & {
		children: React.ReactNode;
	}
> = ({ children, ...props }) => {
	return (
		<WidgetItemContext.Provider value={props}>
			{children}
		</WidgetItemContext.Provider>
	);
};

export const useWidgets = () => {
	const context = useContext(WidgetsContext);
	if (!context) {
		throw new Error("useWidgets must be used within WidgetsProvider");
	}
	return context;
};

export const useWidgetItem = () => {
	const context = useContext(WidgetItemContext);
	if (!context) {
		throw new Error("useWidgetItem must be used within WidgetItemProvider");
	}
	return context;
};

export const useWidgetItemParams = () => {
	return useWidgetItem().params;
};

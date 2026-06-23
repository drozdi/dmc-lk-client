import { createContext, useContext } from "react";
import { type StoreApi, type UseBoundStore, useStore } from "zustand";

export interface DashboardProviderProps {
	children: React.ReactNode;
	store: UseBoundStore<StoreApi<WidgetContextType>>;
}

export const DashboardContext = createContext<WidgetContextType | undefined>(undefined);

export const DashboardProvider: React.FC<DashboardProviderProps> = ({
	children,
	store,
}) => {
	return (
		<DashboardContext.Provider value={useStore(store)}>
			{children}
		</DashboardContext.Provider>
	);
};

export const useDashboard = () => {
	const context = useContext(DashboardContext);
	if (!context) {
		throw new Error("useDashboard must be used within DashboardProvider");
	}
	return context;
};


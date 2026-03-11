import { createContext, useContext } from "react";
import { type StoreApi, type UseBoundStore, useStore } from "zustand";

interface DashboardProviderProps {
	children: React.ReactNode;
	store: UseBoundStore<StoreApi<DashboardContextType>>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
	undefined,
);

const DashboardItemContext = createContext<IWidgetItem | undefined>(undefined);

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

export const DashboardItemProvider: React.FC<
	IWidgetItem & {
		children: React.ReactNode;
	}
> = ({ children, ...props }) => {
	return (
		<DashboardItemContext.Provider value={props}>
			{children}
		</DashboardItemContext.Provider>
	);
};

export const useDashboard = () => {
	const context = useContext(DashboardContext);
	if (!context) {
		throw new Error("useDashboard must be used within DashboardProvider");
	}
	return context;
};

export const useDashboardItem = () => {
	const context = useContext(DashboardItemContext);
	if (!context) {
		throw new Error("useDashboard must be used within DashboardProviderItem");
	}
	return context;
};

export const useDashboardItemParams = () => {
	return useDashboardItem().params;
};

import { createContext, useCallback, useContext } from "react";
import { useDashboard } from "./dashboard";

export const WidgetContext = createContext<IWidgetItem | undefined>(undefined);

export const WidgetProvider: React.FC<
	IWidgetItem & {
		children: React.ReactNode;
	}
> = ({ children, ...props }) => {
	return (
		<WidgetContext.Provider value={props}>
			{children}
		</WidgetContext.Provider>
	);
};


export const useWidget = (): IWidgetItem => {
	const context = useContext(WidgetContext);
	if (!context) {
		throw new Error("useWidget must be used within WidgetProvider");
	}
	return context;
};

export const useWidgetParams = () => {
	const widget = useWidget();
	const dashboard = useDashboard();
	const update = useCallback<(key: string, value: never) => void>((key, value) => {
		if (!widget?.id) {
			return
		}
		dashboard.updateWidget({...widget, params: {...widget.params, [key]: value}})
	}, [widget])
	return [widget.params, update];
};

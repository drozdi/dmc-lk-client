import { Outlet } from "react-router-dom";
import { LabelsCountPage } from "../../pages/labels/lables-count-page";
import { LabelsPage } from "./pages/lables-page";

export default function ({ path = "/labels" }: AppRouterProps = {}): object {
	return {
		path: path,
		element: <Outlet />,
		children: [
			{
				path: "",
				element: <LabelsPage />,
			},
			{
				path: "count",
				element: <LabelsCountPage />,
			},
		],
	};
}

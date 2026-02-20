import { create } from "zustand";

interface IWidget {
	id: string;
	title: string;
	description: string;
	element: React.ReactNode;
	icon: React.ReactNode;
	params: {
		[key: string]: any;
	};
}

interface IStoreDashBoard {
	widgets: IWidget[];
}

export const useStoreDashBoard = create<IStoreDashBoard>((set, get) => ({
	widgets: [],
}));

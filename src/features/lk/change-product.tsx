import { useStoreUserProfile } from "@/entites/auth";
import { MultiSelectProductions } from "@/entites/users";
import { useShallow } from "zustand/shallow";

export const ChangeProduct = () => {
	const { productions, setProductions } = useStoreUserProfile(useShallow(state => ({
		userInfo: state.userInfo,
		productions: state.productions,
		setProductions: state.setProductions,
	})));

	const handleChange = (value: string[]) => {
		setProductions(value);
	};

	return <MultiSelectProductions
		variant="underline"
		value={productions as string[]}
		allLabel="Все площадки"
		maw={200}
		mah={60}
		style={{
			overflow: "hidden",
		}}
		onChange={(value) => handleChange(value)}
	/>
};

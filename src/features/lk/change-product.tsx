import { useStoreUserProfile } from "@/entites/auth";
import { SelectProductions } from "@/entites/users";
import { useShallow } from "zustand/shallow";

export const ChangeProduct = () => {
	const { userInfo, production_id, setProductionId } = useStoreUserProfile(useShallow(state => ({
		userInfo: state.userInfo,
		production_id: state.production_id,
		setProductionId: state.setProductionId,
	})));

	const handleChange = (value: string) => {
		setProductionId(Number(value));
	};

	return <SelectProductions
		allowDeselect={false}
		excludeds={userInfo?.is_superuser ? [] : ["0"]}
		variant="underline"
		value={String(production_id)}
		onChange={(value) => handleChange(value as string)}
	/>
};

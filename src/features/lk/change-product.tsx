import { useStoreUserProfile } from "@/entites/auth";
import { SelectProductions, useQueryProductions } from "@/entites/users";

export const ChangeProduct = () => {
	const storeUserProfile = useStoreUserProfile();
	const qpl = useQueryProductions();

	const handleChange = (value: string) => {
		storeUserProfile.setProductionId(Number(value));
	};

	return (
			<SelectProductions
					allowDeselect={false}
					excludeds={storeUserProfile.userInfo?.is_superuser ? [] : ["0"]}
					variant="underline"
					value={String(storeUserProfile.production_id)}
					onChange={(value) => handleChange(value as string)}
				/>
	);
};

import { useStoreUserProfile } from "@/entites/auth";
import { SelectProductions, useQueryProductions } from "@/entites/users";
import { useMemo, useState } from "react";

export const ChangeProduct = () => {
	const storeUserProfile = useStoreUserProfile();
	const userData = storeUserProfile.userData;
	const qpl = useQueryProductions();
	const [change, setChange] = useState<boolean>(false);

	const handleChange = (value: string) => {
		storeUserProfile.setProductionId(Number(value));
		setChange(false);
	};

	// useEffect(() => {
	// 	if (userData) {
	// 		if (
	// 			!userData.is_superuser &&
	// 			!userData.id_production?.includes(
	// 				Number(storeUserProfile.production_id),
	// 			)
	// 		) {
	// 			userData.id_production?.length &&
	// 				handleChange(String(userData.id_production?.[0]));
	// 		}
	// 	}
	// }, [userData, handleChange]);

	const name = useMemo(
		() => qpl.findNameById(Number(storeUserProfile.production_id)),
		[qpl.findNameById, storeUserProfile.production_id],
	);

	return (
		<>
			{change ? (
				<SelectProductions
					allowDeselect={false}
					excludeds={storeUserProfile.userData?.is_superuser ? [] : ["0"]}
					variant="underline"
					value={String(storeUserProfile.production_id)}
					onChange={(value) => handleChange(value as string)}
				/>
			) : (
				<span className="cursor-pointer" onClick={() => setChange(true)}>
					{name}
				</span>
			)}
		</>
	);
};

import { useStoreUserProfile } from "@/entites/auth";
import { useQueryProductions } from "@/entites/users";
import { Select } from "@mantine/core";
import { useState } from "react";

export const ChangeProduct = () => {
	const storeUserProfile = useStoreUserProfile();
	const qpl = useQueryProductions();
	const [change, setChange] = useState<boolean>(false);

	const handleChange = (value: string) => {
		storeUserProfile.setProductionId(Number(value));
		setChange(false);
	};

	return (
		<>
			{change ? (
				<Select
					variant="underline"
					value={String(storeUserProfile.production_id)}
					onChange={(value) => handleChange(value as string)}
					data={qpl.dataSelect}
				/>
			) : (
				<span
					className="cursor-pointer"
					onClick={() => setChange(true)}
				>
					{qpl.findNameById(Number(storeUserProfile.production_id))}
				</span>
			)}
		</>
	);
};

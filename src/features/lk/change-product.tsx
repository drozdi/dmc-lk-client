import { useStoreUserProfile } from "@/entites/auth";
import { useQueryProductList } from "@/entites/users";
import { Select } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useState } from "react";

export const ChangeProduct = observer(() => {
	const storeUserProfile = useStoreUserProfile();
	const qpl = useQueryProductList();
	const [change, setChange] = useState<boolean>(false);

	const handleChange = (value: string) => {
		storeUserProfile.setProductId(value);
		setChange(false);
	};
	return (
		<>
			{change ? (
				<Select
					variant="filled"
					value={String(storeUserProfile.product_id)}
					onChange={(value) => handleChange(value as string)}
					data={qpl.dataSelect}
				/>
			) : (
				<span
					className="cursor-pointer"
					onClick={() => setChange(true)}
				>
					{qpl.findNameById(storeUserProfile.product_id)}
				</span>
			)}
		</>
	);
});

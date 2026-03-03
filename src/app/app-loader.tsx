import { useStoreAuth, useStoreUserProfile } from "@/entites/auth/stores";
import { useStoreCountLabel, useStoreLabels } from "@/entites/labels";
import { useQueryLoading } from "@/shared/hooks";
import { Loading } from "@/shared/ui";
import { useEffect } from "react";

export const AppLoader = ({ children }: { children: React.ReactNode }) => {
	const storeAuth = useStoreAuth();
	const storeUserProfile = useStoreUserProfile();
	const storeCountLabel = useStoreCountLabel();
	const storeLabels = useStoreLabels();

	const isLoading = useQueryLoading(
		storeAuth,
		storeUserProfile,
		storeLabels,
		storeCountLabel,
	);

	useEffect(() => {
		storeUserProfile.load();
		if (storeAuth.isAuthenticated) {
			// storeUserProfile.load(true);
			storeLabels.load();
			storeCountLabel.load();
		} else {
			storeUserProfile.reset();
		}
	}, [storeAuth.isAuthenticated]);

	useEffect(() => {
		const userData = storeUserProfile.userData;
		if (userData) {
			if (
				!userData.is_superuser &&
				!userData.id_production?.includes(
					Number(storeUserProfile.production_id),
				)
			) {
				userData.id_production?.length &&
					storeUserProfile.setProductionId(
						Number(userData.id_production[0]),
					);
			}
		}
	}, [storeUserProfile]);

	return (
		<Loading keepMounted active={isLoading}>
			{children}
		</Loading>
	);
};

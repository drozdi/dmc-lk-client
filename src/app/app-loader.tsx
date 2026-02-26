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
		if (storeAuth.isAuthenticated) {
			storeUserProfile.load(true);
		} else {
			storeUserProfile.reset();
		}
	}, [storeAuth.isAuthenticated]);
	return (
		<Loading keepMounted active={isLoading}>
			{children}
		</Loading>
	);
};

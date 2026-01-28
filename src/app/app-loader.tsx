import { useStoreAuth, useStoreUserProfile } from "@/entites/auth/stores";
import { useQueryLoading } from "@/shared/hooks";
import { Loading } from "@/shared/ui";
import { useEffect } from "react";

export const AppLoader = ({ children }: { children: React.ReactNode }) => {
	const storeAuth = useStoreAuth();
	const storeUserProfile = useStoreUserProfile();
	const isLoading = useQueryLoading(storeAuth, storeUserProfile);
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

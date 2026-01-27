import { useStoreAuth, useStoreUserProfile } from "@/entites/auth/stores";
import { useEffect } from "react";

export const AppLoader = ({ children }: { children: React.ReactNode }) => {
	const storeAuth = useStoreAuth();
	const storeUserProfile = useStoreUserProfile();

	useEffect(() => {
		if (storeAuth.isAuthenticated) {
			storeUserProfile.load(true);
		} else {
			storeUserProfile.reset();
		}
	}, [storeAuth.isAuthenticated]);
	return children;
};

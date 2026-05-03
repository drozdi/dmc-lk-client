import { useStoreAuth, useStoreUserProfile } from "@/entites/auth";
import {
	useStoreDashboardMain,
	useStoreDashboardSecond,
} from "@/entites/widget";
import { useEffect } from "react";

export const AppLoader = ({ children }: { children: React.ReactNode }) => {
	const storeAuth = useStoreAuth();
	const storeUserProfile = useStoreUserProfile();

	useEffect(() => {
		if (!storeAuth.isAuthenticated) {
			return
		}
		useStoreDashboardMain.resetFromDB();
		useStoreDashboardSecond.resetFromDB();
		storeUserProfile.load();
	}, [storeAuth.isAuthenticated]);

	useEffect(() => {
		const userData = storeUserProfile.userInfo;
		if (userData) {
			if (
				!userData.is_superuser &&
				!userData.id_production?.includes(
					Number(storeUserProfile.production_id),
				)
			) {
				userData.id_production?.length &&
					storeUserProfile.setProductionId(Number(userData.id_production[0]));
			}
		}
	}, [storeUserProfile.userInfo]);

	return children;
};

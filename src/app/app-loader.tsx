import { useStoreAuth, useStoreUserProfile } from "@/entites/auth";
import {
	useStoreDashboardMain,
	useStoreDashboardSecond,
} from "@/entites/dashboard";
import { useQueryProductions } from '@/entites/users';
import { useEffect } from "react";

export const AppLoader = ({ children }: { children: React.ReactNode }) => {
	const storeAuth = useStoreAuth();
	const storeUserProfile = useStoreUserProfile();
	const { data } = useQueryProductions()

	useEffect(() => {
		if (!storeAuth.isAuthenticated) {
			return
		}
		useStoreDashboardMain.resetFromDB();
		useStoreDashboardSecond.resetFromDB();
		storeUserProfile.load();
	}, [storeAuth.isAuthenticated]);

	useEffect(() => {
		if (!storeAuth.isAuthenticated) {
			return
		}
		if (!storeUserProfile.isLoading) {
			const { productions, setProductions } = storeUserProfile;
			if (!productions?.length) {
				setProductions((data || [])?.map(item => String(item.production_id)))
			}	
		}
	}, [data, storeUserProfile.isLoading, storeAuth.isAuthenticated]);

	return children;
};

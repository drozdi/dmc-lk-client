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
	const { data, refetch } = useQueryProductions()

	useEffect(() => {
		if (!storeAuth.isAuthenticated) {
			return
		}
		useStoreDashboardMain.resetFromDB();
		useStoreDashboardSecond.resetFromDB();
		(async function () {
			await storeUserProfile.load();
			await refetch?.()
		})()
	}, [storeAuth.isAuthenticated]);

	useEffect(() => {
		if (!storeAuth.isAuthenticated) {
			return
		}
		const { productions, setProductions } = storeUserProfile;
		if (data?.length && !productions?.length) {
			setProductions((data || [])?.map(item => String(item.production_id)))
		}	
	}, [data, storeUserProfile.productions, storeAuth.isAuthenticated]);

	return children;
};

import { useStoreAuth, useStoreUserProfile } from "@/entites/auth/stores";
import { queryClient } from "@/shared/api/query-client";
import { Navigate } from "react-router-dom";

export const SignOutPage = () => {
	const storeAuth = useStoreAuth();
	const storeUserProfile = useStoreUserProfile();
	storeUserProfile.reset();
	queryClient.resetQueries();
	storeAuth.logout();
	return <Navigate to="/auth/sign-in" />;
};

import { useStoreAuth, useStoreUserProfile } from "@/entites/auth/stores";
import { queryClient } from "@/shared/api/query-client";
import { Navigate } from "react-router-dom";

export const SignOutPage = () => {
	const storeAuth = useStoreAuth();
	const storeUserProfile = useStoreUserProfile();
	storeAuth.logout();
	storeUserProfile.reset();
	queryClient.resetQueries();
	return <Navigate to="/" />;
};

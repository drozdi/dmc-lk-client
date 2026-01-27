import { useStoreAuth, useStoreUserProfile } from "@/entites/auth/stores";
import { observer } from "mobx-react-lite";
import { Navigate } from "react-router-dom";

export const SignOutPage = observer(() => {
	const storeAuth = useStoreAuth();
	const storeUserProfile = useStoreUserProfile();
	storeAuth.logout();
	storeUserProfile.reset();
	return <Navigate to="/" />;
});

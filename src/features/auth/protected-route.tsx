import { useStoreAuth } from "@/entites/auth";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const storeAuth = useStoreAuth();
	if (!storeAuth.isAuthenticated) {
		return <Navigate to="/auth/sign-in" replace />;
	}
	return children;
};

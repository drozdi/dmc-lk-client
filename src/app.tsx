import { Center, LoadingOverlay } from "@mantine/core";
import { useEffect } from "react";
import { AppLoader } from "./app/app-loader";
import { AppRouters } from "./app/app-routers";
import './app/widgets';
import { useStoreAuth } from "./entites/auth";
import { LoaderStatus } from "./features/loader/status";
import "./shared/style/index.css";

export const App = () => {
	const storeAuth = useStoreAuth();
	useEffect(() => {
		storeAuth.load()
	}, [])

	if (storeAuth.isLoading) {
		return <Center w='100vw' h='100vh'>
			<LoadingOverlay
				visible
				zIndex={1000}
				overlayProps={{ radius: "sm", blur: 2 }}
				loaderProps={{ color: "pink", type: "bars" }}
				/>
		</Center>
	}

	return <AppLoader>
		<LoaderStatus position={{ top: 100, right: 20 }} size="xl" />
		<AppRouters />
	</AppLoader>
};

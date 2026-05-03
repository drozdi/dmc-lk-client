import { QueryCache, QueryClient } from "@tanstack/react-query";

export const queryCache = new QueryCache({});
export const queryClient = new QueryClient({
	queryCache,
	defaultOptions: {
		queries: {
			// enabled: (queryOptions) => {
			// 	const { userInfo } = useStoreUserProfile.getState();
			// 	if (!userInfo) {
			// 		return false;
			// 	}
			// 	return true;
			// },
			throwOnError: false,
			retry: false,
			gcTime: 1000 * 60 * 60 * 24,
		},
	},
});
// queryClient.setDefaultOptions({
// 	...queryClient.getDefaultOptions(),
// 	queries: {
// 		...queryClient.getDefaultOptions().queries,
// 		enabled: true,
// 	},
// });
// console.log("queryClient", queryClient.getDefaultOptions());

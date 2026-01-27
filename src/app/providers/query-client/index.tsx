import { queryClient } from "@/shared/api/query-client";
import { QueryClientProvider as BaseQueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function ProviderQueryClient({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<BaseQueryClientProvider client={queryClient}>
			{children}
			{import.meta.env.DEV && (
				<ReactQueryDevtools initialIsOpen={false} />
			)}
		</BaseQueryClientProvider>
	);
}

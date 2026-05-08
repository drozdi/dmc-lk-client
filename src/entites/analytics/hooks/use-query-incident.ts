import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { requestAnalyticsIncident } from "../api/incident";


const DEFAULT_DATA: IAnalyticsIncidentItem[] = [];

export function useQueryIncident(baseParams: Partial<IRequestAnalyticsIncident> = {}) {
  const queryClient = useQueryClient();
  const [activeParams, setActiveParams] = useState<IRequestAnalyticsIncident | null>(null);

  const {
    data = DEFAULT_DATA,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["incident", activeParams],
    queryFn: async () => await requestAnalyticsIncident(activeParams!).then((res) => res.data),
    staleTime: 0,
    gcTime: 0,
    retry: false,
  });

  // Нормализация ошибки
  const error = queryError
    ? (queryError as any)?.response?.data?.detail ||
      (queryError as Error)?.message ||
      "Неизвестная ошибка"
    : "";

  const fetch = useCallback(
    async (query: Partial<IRequestAnalyticsIncident> = {}): Promise<IResponseAnalytics | undefined> => {
      // Слияние параметров с особым правилом для filterdate
      const mergedParams: IRequestAnalyticsIncident = {
        ...baseParams,
        ...query,
        filterdate: [
          baseParams.filterdate?.[0] ?? query.filterdate?.[0],
          baseParams.filterdate?.[1] ?? query.filterdate?.[1] ?? "",
        ],
      };

      setActiveParams(mergedParams);

      try {
        const result = await queryClient.fetchQuery({
          queryKey: ["analytics", mergedParams],
          queryFn: async () => await requestAnalyticsIncident(mergedParams).then((res) => res.data),
          staleTime: 0,
    			gcTime: 0,
        });
        return result;
      } catch (e) {
        throw e;
      }
    },
    [baseParams, queryClient]
  );

  return {
    data,
    isLoading,
    error,
    fetch,
  };
}
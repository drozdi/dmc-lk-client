import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { requestAnalyticsIncident } from "../api/incident";
import {
	ANALYTICS_QUERY_GC_TIME,
	ANALYTICS_QUERY_STALE_TIME,
} from "../constants";

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
    staleTime: ANALYTICS_QUERY_STALE_TIME,
    gcTime: ANALYTICS_QUERY_GC_TIME,
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
          baseParams.filterdate?.[0] ?? query.filterdate?.[0] ?? '',
          baseParams.filterdate?.[1] ?? query.filterdate?.[1] ?? "",
        ],
      };

      setActiveParams(mergedParams);

      try {
        const result = await queryClient.fetchQuery({
          queryKey: ["incident", mergedParams],
          queryFn: async () => await requestAnalyticsIncident(mergedParams).then((res) => res.data),
          staleTime: ANALYTICS_QUERY_STALE_TIME,
          gcTime: ANALYTICS_QUERY_GC_TIME,
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
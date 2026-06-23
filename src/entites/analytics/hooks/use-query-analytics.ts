import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { requestAnalytics } from "../api/analytics";
import {
	ANALYTICS_QUERY_GC_TIME,
	ANALYTICS_QUERY_STALE_TIME,
} from "../constants";
import { isAnalyticsQueryReady } from "../utils/analytics-query";

// Типы (предположительно определены глобально или импортированы)
// type IRequestAnalytics = ...
// type IResponseAnalytics = ...
// type IError = ...

const DEFAULT_DATA: IResponseAnalytics = {
  id: 0,
	all_records: 0,
	sum_company: 0,
	min_company: 0,
	max_company: 0,
	average_company: 0,
	sum_consumption_m: 0,
	min_consumption_m: 0,
	max_consumption_m: 0,
	average_consumption_m: 0,
	production: [],
};

/**
 * Хук для ленивой загрузки аналитики с использованием React Query.
 * @param baseParams - базовые параметры, которые применяются ко всем запросам
 */
export function useQueryAnalytics(baseParams: Partial<IRequestAnalytics> = {}) {
  const queryClient = useQueryClient();
  const [activeParams, setActiveParams] = useState<IRequestAnalytics | null>(null);

  // Основной запрос – активен только когда параметры заданы
  const {
    data = DEFAULT_DATA,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["analytics", activeParams],
    queryFn: async () => await requestAnalytics(activeParams!).then((res) => res.data),
    enabled: false,
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

  /**
   * Выполнить запрос аналитики с переданными параметрами.
   * @param query - параметры, перекрывающие базовые
   * @returns Promise с данными ответа
   */
  const fetch = useCallback(
    async (query: Partial<IRequestAnalytics> = {}): Promise<IResponseAnalytics | undefined> => {
      const mergedParams = {
        ...baseParams,
        ...query,
        filterdate: [
          baseParams.filterdate?.[0] ?? query.filterdate?.[0] ?? '',
          baseParams.filterdate?.[1] ?? query.filterdate?.[1] ?? "",
        ],
      } as IRequestAnalytics;

      if (!isAnalyticsQueryReady(mergedParams)) {
        return DEFAULT_DATA;
      }

      setActiveParams(mergedParams);


      try {
        const result = await queryClient.fetchQuery({
          queryKey: ["analytics", mergedParams],
          queryFn: async () => await requestAnalytics(mergedParams).then((res) => res.data),
          staleTime: ANALYTICS_QUERY_STALE_TIME,
          gcTime: ANALYTICS_QUERY_GC_TIME,
        });
        return result;
      } catch (e) {
        // Ошибка уже попадёт в queryError, но пробрасываем её дальше
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
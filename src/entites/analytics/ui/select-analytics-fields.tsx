import { factorySelect } from "@/shared/utils";
import { useQueryAnalyticsFields } from "../hooks/use-query-analytics-fields";

export const SelectAnalyticsFields = factorySelect(useQueryAnalyticsFields);

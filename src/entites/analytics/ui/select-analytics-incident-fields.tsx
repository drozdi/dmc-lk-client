import { factorySelect } from "@/shared/utils";
import { useEnumsFields } from "../hooks/use-enums-fields";

export const SelectAnalyticsIncidentFields = factorySelect(useEnumsFields);

import { factorySelect } from "@/shared/utils";
import { useEnumsDetails } from "../hooks/use-enums-details";

export const SelectAnalyticsIncidentDetails = factorySelect(useEnumsDetails);

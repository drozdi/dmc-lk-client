import { factorySelect } from "@/shared/utils";
import { useEnumsActions } from "../hooks/use-enums-actions";

export const SelectActions = factorySelect(useEnumsActions);

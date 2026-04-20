import { factorySelect } from "@/shared/utils";
import { useQueryPlace } from "../hooks/use-query-place";

export const SelectProductions = factorySelect(useQueryPlace);

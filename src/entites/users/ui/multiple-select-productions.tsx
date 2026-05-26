import { factoryMultipleSelect } from "@/shared/utils";
import { useQueryProductions } from "../hooks/use-query-productions";

export const MultiSelectProductions = factoryMultipleSelect(useQueryProductions);

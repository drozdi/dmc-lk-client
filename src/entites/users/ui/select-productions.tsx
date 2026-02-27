import { factorySelect } from "@/shared/utils";
import { useQueryProductions } from "../hooks/use-query-productions";

export const SelectProductions = factorySelect(useQueryProductions);

import { createSafeContext } from "../../../internal/utils/create-safe-context";

export const [XTablerColumsProvider, useXTableColumsContext] =
	createSafeContext("XTable component was not found in the tree");

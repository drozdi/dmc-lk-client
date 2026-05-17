import { createSafeContext } from "../../../internal/utils/create-safe-context";

export const [XTablerProvider, useXTableContext] = createSafeContext(
	"XTable component was not found in the tree"
);

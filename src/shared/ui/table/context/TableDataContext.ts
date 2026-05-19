import { createSafeContext } from "../../../internal/utils/create-safe-context";

export const [TableDataProvider, useTableDataContext] = createSafeContext(
	"XTable component was not found in the tree"
);

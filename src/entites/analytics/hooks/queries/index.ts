// import { factoryQuery } from "@/shared/utils";
// import {
// 	requestAnalyticsQueriesAdd,
// 	requestAnalyticsQueriesDelete,
// 	requestAnalyticsQueriesGet,
// 	requestAnalyticsQueriesList,
// 	requestAnalyticsQueriesUpdate,
// } from "../../api/query_users";

// export const [
// 	useQueryQueryList,
// 	useQueryQueryRead,
// 	useQueryQueryCreate,
// 	useQueryQueryUpdate,
// 	useQueryQueryDelete,
// ] = factoryQuery<IAnalyticsElastic, IRequestList>(
// 	"query_users",
// 	{
// 		id: 0,
// 		name_query: "",
// 		company: {
// 			select_field: [],
// 			list_where: [],
// 			date_limit: {
// 				date_from: "",
// 				date_to: "",
// 				date_rounding: undefined,
// 			},
// 		},
// 		paginate: {
// 			id_record: "",
// 			limit_page: 50,
// 		},
// 	} as IAnalyticsElastic,
// 	requestAnalyticsQueriesList,
// 	requestAnalyticsQueriesGet,
// 	requestAnalyticsQueriesAdd,
// 	requestAnalyticsQueriesUpdate,
// 	requestAnalyticsQueriesDelete,
// );

export * from "./use-query-query-create";
export * from "./use-query-query-delete";
export * from "./use-query-query-list";
export * from "./use-query-query-read";
export * from "./use-query-query-update";

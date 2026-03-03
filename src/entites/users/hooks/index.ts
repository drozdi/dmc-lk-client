import { factoryQuery } from "@/shared/utils";
import {
	requestUsersDelete,
	requestUsersGet,
	requestUsersList,
	requestUsersUpdate,
} from "../api/users";

export const [
	useQueryUsersList,
	useQueryUsersRead,
	useQueryUsersCreate,
	useQueryUsersUpdate,
	useQueryUsersDelete,
] = factoryQuery<IUsersUser, IRequestList>(
	"users",
	{
		first_name: "",
		last_name: "",
		father_name: "",
		email: "",
		phone: "",
		is_superuser: false,
		id_production: [],
		is_active: true,
		id: 0,
	} as IUsersUser,
	requestUsersList,
	requestUsersGet,
	undefined,
	requestUsersUpdate,
	requestUsersDelete,
);

export * from "./use-query-productions";

// export * from "./use-query-users-delete";
// export * from "./use-query-users-list";
// export * from "./use-query-users-read";
// export * from "./use-query-users-update";

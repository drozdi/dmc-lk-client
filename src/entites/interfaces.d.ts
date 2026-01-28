interface IRequestList {
	size?: number;
	number?: number;
}

interface IResponse<T extends object> {
	success: boolean;
	message: string | null | T | IError;
	data: T;
	response: T;
}

interface IResponseList<T extends object> {
	success: boolean;
	message?: string | null | T | IError;
	data: {
		page: number;
		next_page: number;
		previous_page: number;
		size: number;
		total_records: number;
		response: T[] | Record<string, T[]>;
	};
}

interface IResponseObject<T extends object> {
	success: boolean;
	message?: string | null | T | IError;
	data: {
		page: number;
		next_page: number;
		previous_page: number;
		size: number;
		total_records: number;
		response: Record<string, T>;
	};
}

type IError =
	| (any & {
			response?: {
				data?: {
					detail?: string;
				};
			};
			message?: string;
	  })
	| string;

interface IStore {
	error: string;
	isLoading: boolean;
	load(reloading?: boolean): Promise<void>;
}

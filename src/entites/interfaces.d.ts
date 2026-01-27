interface IRequestList {
	size?: number;
	number?: number;
}

interface IResponse<T extends any> {
	success: boolean;
	message?: string | null | T | IError;
	data?: T;
	response?: T;
}

interface IResponseList<T> {
	success: boolean;
	message?: string | null | T;
	data: {
		page: number;
		next_page: number;
		previous_page: number;
		size: number;
		total_records: number;
		response: T[];
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
}

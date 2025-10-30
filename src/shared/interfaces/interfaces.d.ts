interface IAxiosInterceptorDeafult {
	message401?: string
	accessToken?: string
	refreshToken?: string
	accessTokenKey?: string
	refreshTokenKey?: string
	urlRefreshToken?: string | Function
}

interface IAxiosInterceptorConfig extends IAxiosInterceptorDeafult, CreateAxiosDefaults {
	handleRequest?: Function
	handleResponse?: Function
}

interface IAxiosInterceptor extends Axios, IAxiosInterceptorDeafult {
	axiosInstance: AxiosInstance
	isRefreshing: boolean
	refreshSubscribers: ((accessToken: string) => void)[]
	// post: Function
	// get: Function
	// patch: Function
	// delete: Function
	// head: Function
	// options: Function
	// put: Function
}

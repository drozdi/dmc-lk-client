interface IUser {
	first_name: string;
	last_name: string;
	father_name: string;
	email: string;
	phone: string;
	password?: string;
}

interface IStoreAuth extends IStore {
	isAuthenticated: boolean;
	isAuth: boolean;
	load(): Promise<void>;
	clearAuth(): void;
	refreshAuth(): Promise<{ accessToken: string; refreshToken: string }>;
	verification(link: string): Promise<any>;
	login(email: string, password: string): Promise<boolean>;
	register(userData: IUser): Promise<any>;
	logout(): Promise<void>;
}

interface IStoreUserProfile extends IStore {
	userData?: IUser;
	product_id?: string | number;
	setProductId(id: IStoreUserProfile["product_id"]): void;
	setUserData(data: Partial<IUser>): void;
	load(reloading?: boolean): Promise<IUser | undefined>;
	update(userData: IUser): Promise<IUser | undefined>;
	updatePassword(oldPassword: string, newPassword: string): Promise<boolean>;
	delete(): Promise<any>;
	reset(): void;
}

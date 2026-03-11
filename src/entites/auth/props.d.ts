interface IUser {
	first_name: string;
	last_name: string;
	father_name: string;
	email: string;
	phone: string;
	password?: string;
	is_superuser: boolean;
	id_production: IProduction["production_id"][];
}

interface IUserPassword extends IUser {
	re_password: IUser["password"];
}

interface IStoreAuth extends IStore {
	isAuthenticated: boolean;
	isAuth: boolean;
	load(): Promise<void>;
	clearAuth(): void;
	refreshAuth(): Promise<{ accessToken: string; refreshToken: string }>;
	verification(link: string): Promise<any>;
	login(email: string, password: string): Promise<boolean>;
	register(userData: Partial<IUser>): Promise<any>;
	logout(): Promise<void>;
}

interface IStoreUserProfile extends IStore {
	userData?: IUser;
	production_id: IProduction["production_id"];
	setProductionId(id: IProduction["production_id"]): void;
	setUserData(data: Partial<IUser>): void;
	load(reloading?: boolean): Promise<IUser | undefined>;
	update(userData: IUser | Partial<IUser>): Promise<IUser | undefined>;
	updatePassword(oldPassword: string, newPassword: string): Promise<boolean>;
	delete(): Promise<any>;
	reset(): void;
}

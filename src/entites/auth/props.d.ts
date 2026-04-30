interface IUserInfo {
	first_name: string;
	last_name: string;
	father_name: string;
	email: string;
	phone: string;
	password?: string;
	is_superuser: boolean;
	id_production: IProduction["production_id"][];
}

interface IUserPassword extends IUserInfo {
	re_password: IUserInfo["password"];
}

interface ISetting {
	id: integer;
	user_id: IUserInfo["id"];
	setting_name: string;
	meaning: Record<string, any>;
}

interface IStoreAuth extends IStore {
	isAuthenticated: boolean;
	isAuth: boolean;
	load(): Promise<void>;
	clearAuth(): void;
	refreshAuth(): Promise<{ accessToken: string; refreshToken: string }>;
	verification(link: string): Promise<any>;
	login(email: string, password: string): Promise<boolean>;
	register(userData: Partial<IUserInfo>): Promise<any>;
	logout(): Promise<void>;
}

interface IStoreUserProfile extends IStore {
	userInfo?: IUserInfo;
	settings: ISetting[];
	production_id: IProduction["production_id"];

	setProductionId(id: IProduction["production_id"]): void;

	setUserInfo(data: Partial<IUserInfo>): void;
	updateUserInfo(iserInfo: Partial<IUserInfo>): Promise<boolean>;
	updateUserPassword(
		oldPasswoed: IUserInfo["password"],
		newPassword: IUserInfo["password"],
	): Promise<boolean>;

	setSetting(
		name: ISetting["setting_name"],
		value?: ISetting["meaning"],
	): Promise<void>;
	getSetting(name: ISetting["setting_name"]): ISetting["meaning"] | undefined;

	updateSettings(): Promise<void>;

	loadUserInfo(reloading?: boolean): Promise<IUserInfo | undefined>;
	loadSettings(reloading?: boolean): Promise<boolean>;
	load(reloading?: boolean): Promise<boolean>;

	reset(): void;
}

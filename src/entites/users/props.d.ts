interface IUsersUser extends IUser {
	is_superuser: boolean;
	id_production: (number | string)[];
	is_active: boolean;
	id: number;
}

interface IProduction {
	production_id: number | string;
	production_name?: string;
	name_production?: string;
}

interface IPlace {
	place_type: string;
	place_name: string;
	place_id: number;
	production_id: IProduction["production_id"];
}

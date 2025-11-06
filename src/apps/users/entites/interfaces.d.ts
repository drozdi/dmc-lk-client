interface IUsersUser {
	first_name: string
	last_name: string
	father_name: string
	email: string
	phone: string
	is_superuser: boolean
	id_production: (number | string)[]
	is_active: boolean
	id: number
}

interface IResponseProduction {
	production_id: number
	name_production: string
}

interface IProduction {
	production_id: number
	production_name: string
}

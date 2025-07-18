interface IShopProduct {
	product_code?: string
	product_name?: string
	product_art?: string
	product_typeproduct?: string
	product_parent?: string
	product_price?: number
	picture?: string | null
	count_product?: number
}

interface IShopGroup {
	is_folder?: boolean
	group_code?: string
	group_name?: string
}

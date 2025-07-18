import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Loading } from '../../../shared/ui'
import { getProducts } from '../api/api'
import { cartStore } from '../stores/cart-store'
import { GroupView } from './view/group-view'
import { ProductView } from './view/product-view'

interface ShopGroupProps {
	groupId?: number | string
}

export const ShopGroup = observer(({ groupId }: ShopGroupProps) => {
	const navigate = useNavigate()
	const [data, setData] = useState<any>([])
	const [isLoading, setIsLoading] = useState(false)

	const get__ = async (...args) => {
		setIsLoading(true)
		const res = await getProducts(...args)
		setData(res)
		setIsLoading(false)
	}
	const groups = useMemo<any[]>(() => {
		return data?.groups || data || []
	}, [data, groupId])
	const products = useMemo<any[]>(() => {
		if (!groupId) {
			return []
		}
		return data.products || []
	}, [data, groupId])

	useEffect(() => {
		get__({
			group: groupId,
		})
	}, [groupId])

	const handleClickGroup = (item: IShopGroup) => {
		navigate(`/shop/group/${item.group_code}`)
	}
	const handleAddCart = (item: IShopProduct) => {
		console.log(item)
		cartStore.addToCart(item)
	}

	return (
		<Loading active={isLoading}>
			<div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6'>
				{groupId && (
					<GroupView
						item={{
							group_code: 'back',
							group_name: 'Назад',
							is_folder: true,
						}}
						onClick={() => {
							navigate(-1)
						}}
					/>
				)}
				{((groups as Array<IShopGroup>) || []).map((item: IShopGroup) => (
					<GroupView
						key={item.group_code}
						item={item}
						onClick={() => handleClickGroup(item)}
					/>
				))}
				{products.map((item: IShopProduct) => (
					<ProductView
						key={item.product_code}
						item={item}
						onAddCart={() => handleAddCart(item)}
					/>
				))}
			</div>
		</Loading>
	)
})

import { Drawer } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { TbArrowNarrowRight } from 'react-icons/tb'
import { ProductCartView } from '../features/view/product-cart-view'
import { cartStore } from '../stores/cart-store'

export const ShopCart = observer(() => {
	const { opened, list } = cartStore

	const handleIncrease = item => {
		cartStore.setCountProduct(item.id, item.count_product + 1)
	}
	const handleDecrease = item => {
		cartStore.setCountProduct(item.id, item.count_product - 1)
	}

	return (
		<Drawer title='Корзина' opened={opened} onClose={() => cartStore.close()}>
			{list.map(item => (
				<ProductCartView
					key={item.id}
					item={item}
					onIncrease={() => handleIncrease(item)}
					onDecrease={() => handleDecrease(item)}
				/>
			))}
			<a className='flex items-center justify-center mt-4 px-3 py-2 bg-blue-600 text-white text-sm uppercase font-medium rounded hover:bg-blue-500 focus:outline-none focus:bg-blue-500'>
				<span>Chechout</span>
				<TbArrowNarrowRight />
			</a>
		</Drawer>
	)
})

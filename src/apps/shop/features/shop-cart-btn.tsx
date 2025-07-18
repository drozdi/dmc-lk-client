import { observer } from 'mobx-react-lite'
import { TbShoppingCart } from 'react-icons/tb'
import { cartStore } from '../stores/cart-store'

export const ShopCartBtn = observer(() => {
	return (
		<button
			className='relative flex items-center justify-center text-2xl text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
			onClick={() => cartStore.toogle()}
		>
			<TbShoppingCart />
		</button>
	)
})

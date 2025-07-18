import { observer } from 'mobx-react-lite'
import { TbArrowNarrowRight, TbX } from 'react-icons/tb'
import { cls } from '../../../shared/utils'
import { cartStore } from '../stores/cart-store'
import { ProductCartView } from './view/product-cart-view'

export const ShopCart = observer(() => {
	const { opened, list } = cartStore

	const handleIncrease = item => {
		cartStore.setCountProduct(item.id, item.count_product + 1)
	}
	const handleDecrease = item => {
		cartStore.setCountProduct(item.id, item.count_product - 1)
	}

	return (
		<div
			className={cls(
				'absolute right-0 top-0 bottom-0 max-w-xs w-full px-6 py-4 transition duration-300 transform overflow-y-auto bg-white border-l-2 border-gray-300',
				opened ? 'translate-x-0 ease-out' : 'translate-x-full ease-in'
			)}
		>
			<div className='flex items-center justify-between'>
				<h3 className='text-2xl font-medium text-gray-700'>Your cart</h3>
				<button
					onClick={() => cartStore.close()}
					className='text-gray-600 focus:outline-none cursor-pointer'
				>
					<TbX size='1.5rem' />
				</button>
			</div>
			<hr className='my-3' />
			{list.map(item => (
				<ProductCartView
					key={item.id}
					item={item}
					onIncrease={() => handleIncrease(item)}
					onDecrease={() => handleDecrease(item)}
				/>
			))}

			<div className='mt-8'>
				<form className='flex items-center justify-center'>
					<input
						className='form-input w-48'
						type='text'
						placeholder='Add promocode'
					/>
					<button className='ml-3 flex items-center px-3 py-2 bg-blue-600 text-white text-sm uppercase font-medium rounded hover:bg-blue-500 focus:outline-none focus:bg-blue-500'>
						<span>Apply</span>
					</button>
				</form>
			</div>
			<a className='flex items-center justify-center mt-4 px-3 py-2 bg-blue-600 text-white text-sm uppercase font-medium rounded hover:bg-blue-500 focus:outline-none focus:bg-blue-500'>
				<span>Chechout</span>
				<TbArrowNarrowRight />
			</a>
		</div>
	)
})

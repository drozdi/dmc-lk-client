import { TbCircleMinus, TbCirclePlus } from 'react-icons/tb'
import { cartStore } from '../../../entites/shop/cart-store'
import { currencyFormat } from '../../../shared/utils'

interface ProductCartViewProps {
	className?: string
	item: IShopProduct
	onAddCart?: () => void
	[key: string]: any
}

export function ProductCartView({
	item,
	className,
	onAddCart,
	...props
}: ProductCartViewProps) {
	const urlPic = '/assests/shop/not-product.png'
	const { count_product, product_code } = item
	const handlePlus = () => {
		cartStore.setCountProduct(product_code, count_product + 1)
	}
	const handleMinus = () => {
		cartStore.setCountProduct(product_code, count_product - 1)
	}
	return (
		<div className='flex justify-between mt-6'>
			<div className='flex'>
				<img
					className='h-20 w-20 object-cover rounded'
					src={urlPic}
					alt={item.product_name}
				/>

				<div className='mx-3'>
					<h3 className='text-sm text-gray-600'>{item.product_name}</h3>
					<div className='flex items-center mt-2'>
						<button
							className='text-gray-500 focus:outline-none focus:text-gray-600'
							onClick={handlePlus}
						>
							<TbCirclePlus />
						</button>
						<span className='text-gray-700 mx-2'>{count_product}</span>
						<button
							className='text-gray-500 focus:outline-none focus:text-gray-600'
							onClick={handleMinus}
						>
							<TbCircleMinus />
						</button>
					</div>
				</div>
			</div>
			<span className='text-gray-600'>
				{currencyFormat(item.product_price * count_product)}
			</span>
		</div>
	)
}

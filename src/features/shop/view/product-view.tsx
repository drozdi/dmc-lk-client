import { TbShoppingCartPlus } from 'react-icons/tb'
import { cls, currencyFormat } from '../../../shared/utils'

interface ProductViewProps {
	className?: string
	item: IShopProduct
	onAddCart?: () => void
	[key: string]: any
}

export function ProductView({
	item,
	className,
	onAddCart,
	...props
}: ProductViewProps) {
	const urlPic = '/assests/shop/not-product.png'
	return (
		<div
			{...props}
			className={cls(
				'w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden',
				className
			)}
		>
			<div
				className='flex items-end justify-end h-56 w-full bg-cover bg-center'
				style={{
					backgroundImage: `url('${urlPic}')`,
				}}
			>
				<button
					className='p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500 cursor-pointer'
					onClick={onAddCart}
				>
					<TbShoppingCartPlus />
				</button>
			</div>
			<div className='px-5 py-3'>
				<h3 className='text-gray-700 uppercase'>{item.product_name}</h3>
				<span className='text-gray-500 mt-2'>
					{currencyFormat(item.product_price)}
				</span>
			</div>
		</div>
	)
}

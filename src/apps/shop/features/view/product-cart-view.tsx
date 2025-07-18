import { TbCircleMinus, TbCirclePlus } from 'react-icons/tb'
import { cls, currencyFormat } from '../../../../shared/utils'

interface ProductCartViewProps {
	className?: string
	item: IShopProduct
	onIncrease?: () => void
	onDecrease?: () => void
	[key: string]: any
}

export function ProductCartView({
	item,
	className,
	onIncrease,
	onDecrease,
	...props
}: ProductCartViewProps) {
	const urlPic = '/assests/shop/not-product.png'
	const { count_product = 1, product_price, product_code, product_name } = item
	const label = product_name ?? product_code
	const price = count_product * (product_price || 0)
	return (
		<div {...props} className={cls('flex justify-between mt-6', className)}>
			<div className='flex'>
				<img
					className='h-20 w-20 object-cover rounded'
					src={urlPic}
					alt={label}
				/>

				<div className='mx-3'>
					<h3 className='text-sm text-gray-600'>{label}</h3>
					<div className='flex items-center mt-2'>
						<button
							className='text-gray-500 focus:outline-none focus:text-gray-600'
							onClick={onIncrease}
						>
							<TbCirclePlus />
						</button>
						<span className='text-gray-700 mx-2'>{count_product}</span>
						<button
							className='text-gray-500 focus:outline-none focus:text-gray-600'
							onClick={onDecrease}
						>
							<TbCircleMinus />
						</button>
					</div>
				</div>
			</div>
			<span className='text-gray-600'>{currencyFormat(price)}</span>
		</div>
	)
}

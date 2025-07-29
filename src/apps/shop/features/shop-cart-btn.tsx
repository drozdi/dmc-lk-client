import { observer } from 'mobx-react-lite'
import { TbShoppingCart } from 'react-icons/tb'
import { Link } from '../../../components/layout/components/link'
import { cartStore } from '../stores/cart-store'

export const ShopCartBtn = observer(() => {
	return (
		<Link onClick={() => cartStore.toogle()}>
			<TbShoppingCart />
		</Link>
	)
})

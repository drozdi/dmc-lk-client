import { ActionIcon } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { TbShoppingCart } from 'react-icons/tb'
import { cartStore } from '../stores/cart-store'

export const ShopCartBtn = observer(() => {
	return (
		<ActionIcon
			variant='default'
			aria-label='Корзина'
			size='xl'
			radius='100%'
			title='Корзина'
			color={cartStore.opened ? 'blue.6' : ''}
			onClick={() => cartStore.toogle()}
		>
			<TbShoppingCart />
		</ActionIcon>
	)
})

import { useParams } from 'react-router'
import { ShopGroup } from '../../features/shop/shop-group'

export function ShopGroupPage() {
	const { groupId } = useParams()
	return <ShopGroup groupId={groupId} />
}

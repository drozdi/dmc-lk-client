import { useParams } from 'react-router-dom'
import { ShopGroup } from '../features/shop-group'

export function ShopGroupPage() {
	const { groupId } = useParams()
	return <ShopGroup groupId={groupId} />
}

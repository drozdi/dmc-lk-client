import { observer } from 'mobx-react-lite'
import { useMemo, useState } from 'react'
import { userStore } from '../../stores/user-store'

import { DmcSelect } from '../../../shared/ui'

export const ChangeProduct = observer(() => {
	const { products, currentProductId } = userStore
	const [change, setChange] = useState<boolean>(false)
	const currentName = useMemo(() => {
		return (
			products.find(product => product.production_id == currentProductId)
				?.name_production || ''
		)
	}, [products, currentProductId])

	const handleChange = ({ target }: React.ChangeEvent) => {
		userStore.setCurrentProductId(target.value)
		setChange(false)
	}
	return (
		<>
			{change ? (
				<DmcSelect
					dense
					filled
					value={String(currentProductId)}
					onChange={handleChange}
				>
					{products.map(product => (
						<option key={product.production_id} value={product.production_id}>
							{product.name_production}
						</option>
					))}
				</DmcSelect>
			) : (
				<span className='cursor-pointer' onClick={() => setChange(true)}>
					{currentName}
				</span>
			)}
		</>
	)
})

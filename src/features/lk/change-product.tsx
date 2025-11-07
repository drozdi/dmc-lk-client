import { Select } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useMemo, useState } from 'react'
import { userStore } from '../../stores/user-store'

export const ChangeProduct = observer(() => {
	const { products, currentProductId } = userStore
	const [change, setChange] = useState<boolean>(false)
	const currentName = useMemo(() => {
		return products.find(product => product.production_id == currentProductId)?.name_production || ''
	}, [products, currentProductId])

	const handleChange = (value: string) => {
		userStore.setCurrentProductId(value)
		setChange(false)
	}
	return (
		<>
			{change ? (
				<Select
					variant='filled'
					value={String(currentProductId)}
					onChange={value => handleChange(value as string)}
					data={products.map(product => ({
						value: String(product.production_id),
						label: product.name_production,
					}))}
				/>
			) : (
				<span className='cursor-pointer' onClick={() => setChange(true)}>
					{currentName}
				</span>
			)}
		</>
	)
})

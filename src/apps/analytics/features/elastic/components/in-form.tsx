import { useState } from 'react'
import { TbXboxX } from 'react-icons/tb'
import { DmcInput } from '../../../../../shared/ui'

export function InForm({
	values,
	onChange,
}: {
	values?: string[]
	onChange?: (values: string[]) => void
}) {
	const [v, setV] = useState('')
	const handleKeyPress = ({ key }: React.KeyboardEvent) => {
		if (key === 'Enter') {
			onChange?.([...(values || []), v])
			setV('')
		}
	}
	const handleRemoveItem = (value: string) => {
		onChange?.(values?.filter(item => value !== item))
	}

	return (
		<ul className='list-none text-left'>
			{((values as string[]) || []).map((item, index) => (
				<li key={index}>
					{item}{' '}
					<TbXboxX
						className='float-right cursor-pointer'
						onClick={() => handleRemoveItem(item)}
					/>
				</li>
			))}
			<li>
				<DmcInput
					filled
					dense
					square
					underlined
					value={v}
					onChange={({ target }) => setV(target.value)}
					onKeyPress={handleKeyPress}
				/>
			</li>
		</ul>
	)
}

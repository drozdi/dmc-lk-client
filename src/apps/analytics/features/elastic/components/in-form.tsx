import { TextInput } from '@mantine/core'
import { useState } from 'react'
import { TbXboxX } from 'react-icons/tb'

export function InForm({ values, onChange }: { values?: string[]; onChange?: (values: string[]) => void }) {
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
		<ul
			style={{
				listStyle: 'none',
			}}
		>
			{((values as string[]) || []).map((item, index) => (
				<li key={index}>
					{item}{' '}
					<TbXboxX
						style={{
							float: 'right',
							cursor: 'pointer',
						}}
						onClick={() => handleRemoveItem(item)}
					/>
				</li>
			))}
			<li>
				<TextInput value={v} onChange={({ target }) => setV(target.value)} onKeyPress={handleKeyPress} />
			</li>
		</ul>
	)
}

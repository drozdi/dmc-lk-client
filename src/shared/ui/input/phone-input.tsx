import { InputBase } from '@mantine/core'
import { IMaskInput } from 'react-imask'
export function PhoneInput({ onChange, ...props }) {
	return (
		<InputBase
			component={IMaskInput}
			type='phone'
			mask='+7 (000) 000-00-00'
			placeholder='+7 (999) 999-99-99'
			{...props}
			onAccept={(value, mask) => {
				onChange?.(value.replace(/[^0-9]/g, ''))
			}}
			prepare={(value, masked) => {
				// Заменяем начало строки на +7
				if (value.startsWith('7') || value.startsWith('8')) {
					return `+7${value.slice(1)}`
				}
				return value.replace(/[^0-9]/g, '')
			}}
			blocks={{
				'0': {
					mask: '0',
					definitionSymbol: '0',
					placeholderChar: '0',
				},
			}}
		/>
	)
}

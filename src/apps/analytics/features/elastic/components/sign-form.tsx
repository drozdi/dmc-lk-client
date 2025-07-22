import { Select } from '../../../../../shared/ui'
export function SignForm({
	value = '',
	onChange,
}: {
	value?: string
	onChange?: (value: string) => void
}) {
	return (
		<Select
			underlined
			dense
			filled
			value={value}
			onChange={({ target }) => onChange?.(target.value)}
		>
			<option value='='>=</option>
			<option value='>='>{'>='}</option>
			<option value='<='>{'<='}</option>
			<option value='!='>!=</option>
			<option value='in'>in</option>
			<option value='not_in'>not_in</option>
			<option value='like'>like</option>
		</Select>
	)
}

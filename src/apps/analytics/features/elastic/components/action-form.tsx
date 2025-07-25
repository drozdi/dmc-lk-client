import { DmcSelect } from '../../../../../shared/ui'
export function ActionForm({
	value = '',
	onChange,
}: {
	value?: string
	onChange?: (value: string) => void
}) {
	return (
		<DmcSelect
			underlined
			dense
			filled
			value={value}
			onChange={({ target }) => onChange?.(target.value)}
		>
			<option value='and'>and</option>
			<option value='or'>or</option>
			<option value='not'>not</option>
		</DmcSelect>
	)
}

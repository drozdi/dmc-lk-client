import { Select } from '@mantine/core'

export function SignForm({ value = '', onChange }: { value?: string; onChange?: (value: string) => void }) {
	return (
		<Select
			value={String(value)}
			onChange={value => onChange?.(value as string)}
			data={['=', '>=', '<=', '!=', 'in', 'not_in', 'like']}
		/>
	)
}

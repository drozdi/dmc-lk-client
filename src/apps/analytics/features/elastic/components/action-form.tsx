import { Select } from '@mantine/core'
export function ActionForm({ value = '', onChange }: { value?: string; onChange?: (value: string) => void }) {
	return <Select value={String(value)} onChange={value => onChange?.(value)} data={['and', 'or', 'not']} />
}

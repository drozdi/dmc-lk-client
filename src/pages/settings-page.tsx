import { Box, Button, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { getBaseUrl, getURLApi, setBaseUrl, setURLApi } from '../shared/utils'

export function SettingsPage() {
	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			api: getURLApi(),
			base: getBaseUrl(),
		},
	})
	function onHandleSubmit(data: { api: string; base: string }) {
		setURLApi(data.api)
		setBaseUrl(data.base)
		window.location.href = getBaseUrl()
	}
	return (
		<Box component='form' w='20rem'>
			<TextInput variant='filled' placeholder='API' label='API' {...form.getInputProps('api')} />
			<TextInput variant='filled' placeholder='Base Router' label='Base Router' {...form.getInputProps('base')} />
			<Button onClick={form.onSubmit(onHandleSubmit)}>Сохранить</Button>
		</Box>
	)
}

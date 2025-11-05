import { Button, Notification, Stack, TextInput } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../../shared/api'
import { authStore } from '../../stores/auth-store'

export const VerificationForm = observer(() => {
	let [searchParams] = useSearchParams()
	const { isLoading, error } = authStore
	const [link, setLink] = useState<string>(searchParams.get('link') || '')
	const navigate = useNavigate()
	async function handleSubmit(e?: FormEvent<HTMLElement>) {
		e?.preventDefault()
		try {
			const data = await authStore.verification(link)
			if (!data.data?.token) {
				return
			}
			api.setAccessToken(data.data.token)
			api.setRefreshToken('')
			navigate('/auth/sign-up')
		} catch (error) {
			console.log(error)
		}
	}
	useEffect(() => {
		if (searchParams.get('link')) {
			handleSubmit()
		}
	}, [])

	return (
		<>
			{error && <Notification color='red'>{error}</Notification>}
			<Stack component='form' name='verification' onSubmit={handleSubmit}>
				<TextInput
					placeholder='Код'
					id='link-code'
					name='link'
					type='text'
					value={link}
					onChange={e => setLink(e.target.value)}
					required
				/>

				<Button type='submit' fullWidth loading={isLoading}>
					Продолжить
				</Button>
			</Stack>
		</>
	)
})

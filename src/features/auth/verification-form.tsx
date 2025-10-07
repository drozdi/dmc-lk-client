import { Button, Notification } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAccessToken } from '../../shared/api/token-service'
import { DmcInput } from '../../shared/ui'
import { authStore } from '../../stores/auth-store'

export const VerificationForm = observer(() => {
	const { isLoading, error } = authStore

	const [link, setLink] = useState('')
	const navigate = useNavigate()
	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		try {
			const data = await authStore.verification(link)
			setAccessToken(data.data.token)
			navigate('/auth/sign-up')
		} catch (error) {
			console.log(error)
		}
	}
	return (
		<>
			{error && <Notification color='red'>{error}</Notification>}
			<form name='verification' className='space-y-3' onSubmit={handleSubmit}>
				<DmcInput
					label='Код'
					placeholder='Код'
					id='link-code'
					name='link'
					type='text'
					value={link}
					onChange={e => setLink(e.target.value)}
					square
					required
					stackLabel
					filled
					underlined
				/>

				<Button type='submit' fullWidth loading={isLoading}>
					Продолжить
				</Button>
			</form>
		</>
	)
})

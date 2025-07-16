import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authStore } from '../../entites/auth/auth-store'
import { Btn, Input, Message } from '../../shared/ui'

export const VerificationForm = observer(() => {
	const { isLoading, error } = authStore

	const [link, setLink] = useState('')
	const navigate = useNavigate()
	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		try {
			const data = await authStore.verification(link)
			authStore.setAccessToken(data.data.token)
			navigate('/auth/sign-up')
		} catch (error) {
			console.log(error)
		}
	}
	return (
		<>
			{error && (
				<Message
					className='mb-8'
					color='warning'
					square
					underlined='left'
					label={error}
				/>
			)}
			<form name='verification' className='space-y-3' onSubmit={handleSubmit}>
				<Input
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

				<Btn type='submit' color='primary' block loading={isLoading}>
					Продолжить
				</Btn>
			</form>
		</>
	)
})

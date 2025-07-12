import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Btn, Input } from '../../shared/ui'

export function VerificationForm() {
	const [isLoading, setIsLoading] = useState(false)
	const navigate = useNavigate()
	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {}
	return (
		<>
			<form className='mt-8 space-y-3' onSubmit={handleSubmit}>
				<Input
					label='Код'
					placeholder='Код'
					id='link-code'
					name='link'
					type='text'
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
}

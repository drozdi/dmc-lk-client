import { yupResolver } from '@hookform/resolvers/yup'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { authStore } from '../../shared/stores/auth-store'
import { Btn, Input, Message } from '../../shared/ui'

interface IUser {
	first_name: string
	last_name: string
	father_name: string
	email: string
	phone: string
	save: boolean
}

const fieldsSchema = yup.object().shape({
	first_name: yup.string().required('Укажите имя'),
	last_name: yup.string().required('Укажите фамилию'),
	father_name: yup.string().required('Укажите отчество'),
	email: yup
		.string()
		.email('Введите корректный email')
		.required('Укажите email'),
	phone: yup
		.string()
		.matches(
			/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
			'Неверный номер телефона'
		)
		.required('Укажите телефон'),
})

export const PersonalForm = observer(() => {
	const { isLoading, error, user } = authStore
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm<IUser>({
		mode: 'onChange',
		defaultValues: {
			first_name: user?.first_name,
			last_name: user?.last_name,
			father_name: user?.father_name,
			email: user?.email,
			phone: user?.phone,
			save: true,
		},
		resolver: yupResolver(fieldsSchema),
	})

	const navigate = useNavigate()

	async function handleSave(formData) {
		await authStore.updateUser(formData)
	}
	async function handleSaveNavigate(formData) {
		try {
			await authStore.updateUser(formData)
			navigate('/')
		} catch (e) {}
	}

	useEffect(() => {
		reset(user)
	}, [user])

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
			<form name='registration' className='space-y-1'>
				<input type='hidden' name='remember' value='true' />
				<Input
					label='Имя'
					placeholder='Имя'
					id='registration_first_name'
					type='text'
					dense
					square
					required
					stackLabel
					filled
					underlined
					errorMessage={errors?.first_name?.message}
					{...register('first_name')}
				/>
				<Input
					label='Фамилия'
					placeholder='Фамилия'
					id='registration_last_name'
					type='text'
					dense
					square
					required
					stackLabel
					filled
					underlined
					errorMessage={errors?.last_name?.message}
					{...register('last_name')}
				/>
				<Input
					label='Отчество'
					placeholder='Отчество'
					id='registration_father_name'
					type='text'
					dense
					square
					required
					stackLabel
					filled
					underlined
					errorMessage={errors?.father_name?.message}
					{...register('father_name')}
				/>
				<Input
					label='Email'
					placeholder='Email'
					id='registration_email'
					type='email'
					dense
					square
					required
					stackLabel
					filled
					underlined
					errorMessage={errors?.email?.message}
					{...register('email')}
				/>

				<Input
					label='Телефон'
					placeholder='Телефон'
					id='registration_phone'
					type='phone'
					dense
					square
					required
					stackLabel
					filled
					underlined
					errorMessage={errors?.phone?.message}
					{...register('phone')}
				/>
				<div className='flex flex-row gap-3'>
					<Btn
						type='button'
						color='success'
						size='xs'
						onClick={handleSubmit(handleSaveNavigate)}
						loading={isLoading}
						disabled={!isValid}
					>
						Сохранить
					</Btn>

					<Btn
						type='button'
						color='primary'
						size='xs'
						onClick={handleSubmit(handleSave)}
						loading={isLoading}
						disabled={!isValid}
					>
						Применить
					</Btn>
				</div>
			</form>
		</>
	)
})

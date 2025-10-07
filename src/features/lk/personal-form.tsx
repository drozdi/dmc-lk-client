import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Notification } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { Template } from '../../layout/context'
import { DmcInput } from '../../shared/ui'
import { userStore } from '../../stores/user-store'

const fieldsSchema = yup.object().shape({
	first_name: yup.string().required('Укажите имя'),
	last_name: yup.string().required('Укажите фамилию'),
	father_name: yup.string().required('Укажите отчество'),
	email: yup.string().email('Введите корректный email').required('Укажите email'),
	phone: yup
		.string()
		.matches(
			/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
			'Неверный номер телефона'
		)
		.required('Укажите телефон'),
})

export const PersonalForm = observer(() => {
	const { isLoading, error, user } = userStore
	console.log(user)
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
		},
		resolver: yupResolver(fieldsSchema),
	})

	const navigate = useNavigate()

	async function handleSave(formData: IUser) {
		await userStore.update(formData)
	}
	async function handleSaveNavigate(formData: IUser) {
		try {
			await userStore.update(formData)
			navigate('/')
		} catch (e) {}
	}
	async function handleRemove() {
		if (!confirm('Вы уверены что хотите удалить себя?')) {
			return
		}
		try {
			//await userStore.remove()
			navigate('/')
		} catch (e) {}
	}

	useEffect(() => {
		reset(user)
	}, [user])

	return (
		<>
			{error && <Notification color='red'>{error}</Notification>}
			<Loading active={isLoading} keepMounted>
				<form name='registration' className='space-y-1'>
					<DmcInput
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
					<DmcInput
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
					<DmcInput
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
					<DmcInput
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

					<DmcInput
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

					<Template slot='footer'>
						<div className='flex flex-row flex-wrap gap-3 justify-between'>
							<div className='flex flex-row gap-3'>
								<Button
									color='green'
									onClick={handleSubmit(handleSaveNavigate)}
									loading={isLoading}
									disabled={!isValid}
								>
									Сохранить
								</Button>

								<Button onClick={handleSubmit(handleSave)} loading={isLoading} disabled={!isValid}>
									Применить
								</Button>
							</div>
							<Button color='red' onClick={handleRemove} loading={isLoading} disabled={!isValid}>
								Удалить
							</Button>
						</div>
					</Template>
				</form>
			</Loading>
		</>
	)
})

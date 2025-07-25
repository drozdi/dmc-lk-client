import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import * as yup from 'yup'
import { DmcBtn, DmcInput, DmcMessage } from '../../../shared/ui'
import { getUser, updateUser } from '../api'

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

interface UserFormProps {
	id?: number
	className?: string
}

export function UserForm({ id, className }) {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm<IUsersUser>({
		mode: 'onChange',
		defaultValues: {
			first_name: '',
			last_name: '',
			father_name: '',
			email: '',
			phone: '',
			is_active: true,
			is_superuser: false,
		},
		resolver: yupResolver(fieldsSchema),
	})

	const navigate = useNavigate()

	async function handleSave(formData: IUsersUser) {
		try {
			await updateUser(id, formData)
		} catch (e) {
			setError(e.message)
		}
	}
	async function handleSaveNavigate(formData: IUsersUser) {
		try {
			await updateUser(id, formData)
			navigate('/users')
		} catch (e) {
			setError(e.message)
		}
	}

	const fetchUser = async () => {
		if (!id) {
			return
		}
		setIsLoading(true)
		try {
			const user = await getUser(id)
			reset(user)
		} catch (e) {
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchUser()
	}, [id])

	return (
		<div className={className}>
			{error && (
				<DmcMessage
					className='mb-8'
					color='warning'
					square
					underlined='left'
					label={error}
				/>
			)}
			<form name='registration' className='space-y-1'>
				<div className='flex flex-col-reverse gap-3 md:flex-row-reverse'>
					<div className='flex-1'>
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
					</div>
					<div className='flex-1'>
						<label className='flex justify-between mb-3'>
							Активный
							<input {...register('is_active')} type='checkbox' />
						</label>
						<label className='flex justify-between mb-3'>
							Суперпользователь
							<input {...register('is_superuser')} type='checkbox' />
						</label>
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
					</div>
				</div>

				<div className='flex flex-row gap-3 justify-end'>
					<DmcBtn
						type='button'
						color='success'
						size='sm'
						onClick={handleSubmit(handleSaveNavigate)}
						loading={isLoading}
						disabled={!isValid}
						label='Сохранить'
					>
						Сохранить
					</DmcBtn>

					<DmcBtn
						type='button'
						color='primary'
						size='sm'
						onClick={handleSubmit(handleSave)}
						loading={isLoading}
						disabled={!isValid}
						label='Применить'
					>
						Применить
					</DmcBtn>
				</div>
			</form>
		</div>
	)
}

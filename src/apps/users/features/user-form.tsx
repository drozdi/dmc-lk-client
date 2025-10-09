import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Notification, Tabs, TextInput } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import * as yup from 'yup'
import { Template } from '../../../layout/context'
import { useQuery } from '../../../shared/hooks'
import { Loading } from '../../../shared/ui'
import { requestGetUser, requestUpdateUser } from '../api'
import { usersStore } from '../stores/users-store'
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

interface UserFormProps {
	id?: number
	className?: string
}

export const UserForm = observer(({ id, className }: UserFormProps) => {
	const { products } = usersStore
	const {
		isLoading: isLoadingGet,
		error: errorGet,
		request: requestGet,
	} = useQuery(requestGetUser, 'Пользователь не найден')
	const { isLoading: isLoadingUpdate, error: errorUpdate, request: requestUpdate } = useQuery(requestUpdateUser)

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors, isValid, isLoading: isLoadingForm },
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
			id_production: [],
		},
		resolver: yupResolver(fieldsSchema),
	})

	const isLoading = useMemo<boolean>(
		() => isLoadingForm || isLoadingGet || isLoadingUpdate,
		[isLoadingForm, isLoadingGet, isLoadingUpdate]
	)
	const error = useMemo<string>(() => errorGet || errorUpdate, [errorGet, errorUpdate])

	async function handleSave(formData: IUsersUser) {
		await requestUpdate(id, formData)
	}
	async function handleSaveNavigate(formData: IUsersUser) {
		await requestUpdate(id, formData)
		useNavigate()('/users')
	}

	const selectProductions = watch('id_production')

	useEffect(() => {
		const fetchUser = async () => {
			if (!id) {
				return
			}
			const user = await requestGet(id)
			user.id_production = (user.id_production || []).map(item => String(item))
			reset(user)
		}
		fetchUser()
	}, [id])

	return (
		<div className={className}>
			<Loading active={isLoading} keepMounted>
				{error && <Notification color='red'>{error}</Notification>}
				<form name='registration' className='space-y-1'>
					<Tabs>
						<Tabs.List grow>
							<Tabs.Tab value='tab-general'>Общие</Tabs.Tab>
							<Tabs.Tab value='tab-product'>Площадки</Tabs.Tab>
						</Tabs.List>

						<Tabs.Panel value='tab-general'>
							<div className='flex flex-col-reverse gap-3 md:flex-row-reverse'>
								<div className='flex-1'>
									<TextInput
										placeholder='Фамилия'
										id='registration_last_name'
										type='text'
										required
										error={errors?.last_name?.message}
										{...register('last_name')}
									/>
									<TextInput
										placeholder='Имя'
										id='registration_first_name'
										type='text'
										required
										error={errors?.first_name?.message}
										{...register('first_name')}
									/>
									<TextInput
										placeholder='Отчество'
										id='registration_father_name'
										type='text'
										required
										error={errors?.father_name?.message}
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
									<TextInput
										placeholder='Email'
										id='registration_email'
										type='email'
										required
										error={errors?.email?.message}
										{...register('email')}
									/>
									<TextInput
										placeholder='Телефон'
										id='registration_phone'
										type='phone'
										required
										error={errors?.phone?.message}
										{...register('phone')}
									/>
								</div>
							</div>
						</Tabs.Panel>
						<Tabs.Panel value='tab-product'>
							{products.map(product => (
								<label key={product.production_id} className='block flex justify-between mt-3 border-b border-color'>
									<span>{product.name_production}</span>
									<input
										type='checkbox'
										value={`${product.production_id}`}
										{...register('id_production')}
										checked={selectProductions.includes(`${product.production_id}`)}
									/>
								</label>
							))}
						</Tabs.Panel>
					</Tabs>

					<Template slot='footer'>
						<div className='flex gap-3 justify-start items-start'>
							<Button color='green' onClick={handleSubmit(handleSaveNavigate)} loading={isLoading} disabled={!isValid}>
								Сохранить
							</Button>
							<Button onClick={handleSubmit(handleSave)} loading={isLoading} disabled={!isValid}>
								Применить
							</Button>
						</div>
					</Template>
				</form>
			</Loading>
		</div>
	)
})

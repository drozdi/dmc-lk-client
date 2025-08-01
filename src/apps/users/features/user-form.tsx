import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import * as yup from 'yup'
import { Template } from '../../../components/context'
import { useQuery } from '../../../shared/hooks'
import {
	DmcBtn,
	DmcInput,
	DmcLoading,
	DmcMessage,
	DmcTabs,
} from '../../../shared/ui'
import { requestGetUser, requestUpdateUser } from '../api'
import { usersStore } from '../stores/users-store'

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

export function UserForm({ id, className }: UserFormProps) {
	const { products } = usersStore
	const {
		isLoading: isLoadingGet,
		error: errorGet,
		request: requestGet,
	} = useQuery(requestGetUser, 'Пользователь не найден')
	const {
		isLoading: isLoadingUpdate,
		error: errorUpdate,
		request: requestUpdate,
	} = useQuery(requestUpdateUser)

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
	const error = useMemo<string>(
		() => errorGet || errorUpdate,
		[errorGet, errorUpdate]
	)

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
			<DmcLoading active={isLoading} keepMounted>
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
					<DmcTabs>
						<DmcTabs.List grow>
							<DmcTabs.Tab value='tab-general'>Общие</DmcTabs.Tab>
							<DmcTabs.Tab value='tab-product'>Площадки</DmcTabs.Tab>
						</DmcTabs.List>
						<DmcTabs.Panels className='pb-3'>
							<DmcTabs.Panel value='tab-general'>
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
							</DmcTabs.Panel>
							<DmcTabs.Panel value='tab-product'>
								{products.map(product => (
									<label
										key={product.production_id}
										className='block flex justify-between mt-3 border-b border-color'
									>
										<span>{product.name_production}</span>
										<input
											type='checkbox'
											value={`${product.production_id}`}
											{...register('id_production')}
											checked={selectProductions.includes(
												`${product.production_id}`
											)}
										/>
									</label>
								))}
							</DmcTabs.Panel>
						</DmcTabs.Panels>
					</DmcTabs>

					<Template slot='footer'>
						<div className='flex gap-3 justify-start items-start'>
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
					</Template>
				</form>
			</DmcLoading>
		</div>
	)
}

import { Button, Checkbox, Group, Notification, Stack, Tabs, TextInput } from '@mantine/core'
import { isEmail, isNotEmpty, useForm } from '@mantine/form'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Template } from '../../../layout/context'
import { useQuery, useQueryError, useQueryLoading } from '../../../shared/hooks'
import { Item, ItemSection, List, Loading, PhoneInput } from '../../../shared/ui'
import { requestUsersGet, requestUsersUpdate } from '../api'
import { usersStore } from '../stores/users-store'

interface UserFormProps {
	id?: number
	className?: string
}

export const UserForm = observer(({ id, className }: UserFormProps) => {
	const { products } = usersStore
	const naigate = useNavigate()
	const reqUserGet = useQuery(requestUsersGet, 'Пользователь не найден')
	const reqUserUpdate = useQuery(requestUsersUpdate)

	const form = useForm({
		mode: 'uncontrolled',
		name: 'userForm',
		initialValues: {
			first_name: '',
			last_name: '',
			father_name: '',
			email: '',
			phone: '',
			is_active: true,
			is_superuser: false,
			id_production: [],
		},
		validate: {
			first_name: isNotEmpty('Укажите имя'),
			last_name: isNotEmpty('Укажите фамилию'),
			father_name: isNotEmpty('Укажите отчество'),
			email: isEmail('Введите корректный email'),
			/*phone: matches(
				/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
				'Неверный номер телефона'
			),*/
		},
		enhanceGetInputProps: ({ inputProps, options }) => {
			if (options.type === 'checkbox') {
				return {
					checked: inputProps.defaultChecked,
				}
			}
		},
	})

	const error = useQueryError(reqUserGet, reqUserUpdate)
	const isLoading = useQueryLoading(reqUserGet, reqUserUpdate)

	async function handleSave(formData: IUsersUser) {
		await reqUserUpdate.request(id, formData)
	}
	async function handleSaveNavigate(formData: IUsersUser) {
		await reqUserUpdate.request(id, formData)
		naigate('/users')
	}

	const handleCheckboxChange = event => {
		const { value, checked } = event.currentTarget
		form.setFieldValue('id_production', currentItems =>
			checked ? [...currentItems, value] : currentItems.filter(item => item !== value)
		)
	}

	useEffect(() => {
		if (!id) {
			return
		}
		reqUserGet.request(id).then(_ => {
			const user = { is_active: true, is_superuser: false, ..._ }
			user.id_production = (user.id_production || []).map(item => String(item))
			form.setValues({
				...user,
			})
			form.resetDirty({
				...user,
			})
		})
	}, [id])

	const isValid = true

	return (
		<>
			<Template slot='notification'>{error && <Notification color='red'>{error}</Notification>}</Template>
			{/* <TemplateTitle>Пользователь - {form.values?.email}</TemplateTitle> */}
			<Loading active={isLoading} keepMounted>
				<form>
					<Tabs defaultValue='tab-general'>
						<Tabs.List grow>
							<Tabs.Tab value='tab-general'>Общие</Tabs.Tab>
							<Tabs.Tab value='tab-product'>Площадки</Tabs.Tab>
						</Tabs.List>
						<Tabs.Panel value='tab-general'>
							<Group>
								<Stack flex={1}>
									<TextInput
										label='Фамилия'
										placeholder='Фамилия'
										required
										variant='underline'
										{...form.getInputProps('last_name')}
									/>
									<TextInput
										label='Имя'
										placeholder='Имя'
										required
										variant='underline'
										{...form.getInputProps('first_name')}
									/>
									<TextInput
										label='Отчество'
										placeholder='Отчество'
										required
										variant='underline'
										{...form.getInputProps('father_name')}
									/>
								</Stack>
								<Stack flex={1}>
									<Checkbox label='Активный' {...form.getInputProps('is_active', { type: 'checkbox' })} />
									<Checkbox label='Суперпользователь' {...form.getInputProps('is_superuser', { type: 'checkbox' })} />
									<TextInput
										placeholder='Email'
										type='email'
										required
										variant='underline'
										{...form.getInputProps('email')}
									/>
									<PhoneInput
										placeholder='Телефон'
										type='phone'
										required
										variant='underline'
										{...form.getInputProps('phone')}
									/>
								</Stack>
							</Group>
						</Tabs.Panel>
						<Tabs.Panel value='tab-product'>
							<List dense separator>
								{products.map(product => (
									<Item component='label' key={product.production_id}>
										<ItemSection top row>
											{product.name_production}
										</ItemSection>
										<ItemSection side>
											<input
												type='checkbox'
												onChange={handleCheckboxChange}
												checked={form.values.id_production.includes(String(product.production_id))}
												value={String(product.production_id)}
											/>
										</ItemSection>
									</Item>
								))}
							</List>
						</Tabs.Panel>
					</Tabs>

					<Template slot='footer'>
						<Group>
							<Button color='green' onClick={form.onSubmit(handleSaveNavigate)} loading={isLoading} disabled={!isValid}>
								Сохранить
							</Button>
							<Button onClick={form.onSubmit(handleSave)} loading={isLoading} disabled={!isValid}>
								Применить
							</Button>
						</Group>
					</Template>
				</form>
			</Loading>
		</>
	)
})

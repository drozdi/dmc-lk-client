import { Button, Group, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { yupResolver } from 'mantine-form-yup-resolver'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { Template } from '../../layout/context'
import { Loading, PhoneInput } from '../../shared/ui'
import { userStore } from '../../stores/user-store'

const fieldsSchema = yup.object().shape({
	first_name: yup.string().required('Заполните имя'),
	last_name: yup.string().required('Заполните фамилию'),
	father_name: yup.string().required('Заполните отчество'),
	email: yup.string().email('Введите корректный email').required('Заполните email'),
	/*phone: yup
		.string()
		.matches(
			/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
			'Неверный номер телефона'
		)
		.required('Заполните телефон'),*/
})

export const PersonalForm = observer(() => {
	const { isLoading } = userStore

	const form = useForm({
		mode: 'uncontrolled',
		name: 'personalForm',
		initialValues: {
			first_name: userStore.userData?.first_name || '',
			last_name: userStore.userData?.last_name || '',
			father_name: userStore.userData?.father_name || '',
			email: userStore.userData?.email || '',
			phone: userStore.userData?.phone || '',
		},
		validate: yupResolver(fieldsSchema),
		onValuesChange: values => {
			userStore.setUserData(values)
		},
	})

	const navigate = useNavigate()

	async function handleSave(formData: IUser) {
		await userStore.update(formData)
	}
	async function handleSaveNavigate(formData: IUser) {
		await userStore.update(formData)
		navigate('/')
	}
	async function handleRemove() {
		if (!confirm('Вы уверены что хотите удалить себя?')) {
			return
		}
		// await userStore.remove()
		// navigate('/')
	}

	const isValid = true

	useEffect(() => {
		// form.setValues(userData)
	}, [])

	return (
		<Loading active={isLoading} keepMounted>
			<Stack component='form'>
				<TextInput placeholder='Имя' size='md' type='text' variant='underline' {...form.getInputProps('first_name')} />
				<TextInput
					placeholder='Фамилия'
					type='text'
					size='md'
					variant='underline'
					{...form.getInputProps('last_name')}
				/>
				<TextInput
					placeholder='Отчество'
					type='text'
					size='md'
					variant='underline'
					{...form.getInputProps('father_name')}
				/>
				<TextInput placeholder='Email' type='email' size='md' variant='underline' {...form.getInputProps('email')} />
				<PhoneInput
					placeholder='Телефон'
					type='phone'
					required
					variant='underline'
					size='md'
					{...form.getInputProps('phone')}
				/>

				<Template slot='footer'>
					<Group>
						<Button color='green' onClick={form.onSubmit(handleSaveNavigate)} loading={isLoading} disabled={!isValid}>
							Сохранить
						</Button>
						<Button onClick={form.onSubmit(handleSave)} loading={isLoading} disabled={!isValid}>
							Применить
						</Button>
					</Group>
					<Button color='red' onClick={handleRemove} loading={isLoading} disabled={!isValid}>
						Удалить
					</Button>
				</Template>
			</Stack>
		</Loading>
	)
})

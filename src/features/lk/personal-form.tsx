import { Button, Group, Stack, TextInput } from '@mantine/core'
import { isEmail, isNotEmpty, matches, useForm } from '@mantine/form'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Template } from '../../layout/context'
import { Loading } from '../../shared/ui'
import { userStore } from '../../stores/user-store'

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
		validate: {
			first_name: isNotEmpty('Укажите имя'),
			last_name: isNotEmpty('Укажите фамилию'),
			father_name: isNotEmpty('Укажите отчество'),
			email: isEmail('Введите корректный email'),
			phone: matches(
				/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
				'Неверный номер телефона'
			),
		},
		onValuesChange: values => {
			userStore.setUserData(values)
		},
	})

	const navigate = useNavigate()

	async function handleSave(formData: IUser) {
		console.log(formData)
		// await userStore.update(formData)
	}
	async function handleSaveNavigate(formData: IUser) {
		console.log(formData)
		try {
			// await userStore.update(formData)
			// navigate('/')
		} catch (e) {}
	}
	async function handleRemove() {
		if (!confirm('Вы уверены что хотите удалить себя?')) {
			return
		}
		try {
			// await userStore.remove()
			// navigate('/')
		} catch (e) {}
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
				<TextInput placeholder='Телефон' type='phone' size='md' variant='underline' {...form.getInputProps('phone')} />

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

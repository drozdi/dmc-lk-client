import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Notification } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { DmcInput } from '../../../shared/ui'
import { authStore } from '../../../stores/auth-store'

const fieldsSchema = yup.object().shape({
	first_name: yup.string().required('Заполните имя'),
	last_name: yup.string().required('Заполните фамилию'),
	father_name: yup.string().required('Заполните отчество'),
	email: yup.string().email('Введите корректный email').required('Заполните email'),
	phone: yup
		.string()
		.matches(
			/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
			'Неверный номер телефона'
		)
		.required('Заполните телефон'),
	password: yup
		.string()
		.required('Пароль обязателен.')
		/*.matches(
			/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]/,
			'Допустимые символы: буквы, цифры и спец. символы @#$%^&*'
		)*/
		.min(6, 'Должно быть не меньше 6 символов')
		.max(16, 'Должно быть не больше 16 символов'),
	re_password: yup
		.string()
		.required('Повтор пароль обязателен.')
		.oneOf([yup.ref('password')], 'Пароли должны совпадать!'),
})

/**
 * {
 * 	"first_name": "string",
 * 	"last_name": "string",
 * 	"email": "string",
 * 	"phone": "string",
 * 	"father_name": "string",
 * 	"password": "string"
 * }
 */

export const SignUpForm = observer(() => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		mode: 'onChange',
		defaultValues: {
			first_name: '',
			last_name: '',
			email: '',
			phone: '',
			father_name: '',
			password: '',
			re_password: '',
		},
		resolver: yupResolver(fieldsSchema),
	})
	const { isLoading, error } = authStore
	const navigate = useNavigate()

	async function sendFormData(formData) {
		if (await authStore.register(formData)) {
			navigate('/lk')
		}
	}

	return (
		<>
			{error && <Notification color='red'>{error}</Notification>}
			<form name='signUp' className='space-y-1' onSubmit={handleSubmit(sendFormData)}>
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

				<DmcInput
					label='Пароль'
					placeholder='Придумай пароль'
					id='registration_password'
					type='password'
					dense
					square
					required
					stackLabel
					filled
					underlined
					errorMessage={errors?.password?.message}
					{...register('password')}
				/>
				<DmcInput
					label='Повторноый пароль'
					placeholder='Повтори пароль'
					id='registration_re_password'
					type='password'
					dense
					square
					required
					stackLabel
					filled
					underlined
					errorMessage={errors?.re_password?.message}
					{...register('re_password')}
				/>

				<Button type='submit' fullWidth loading={isLoading}>
					Войти
				</Button>
			</form>
		</>
	)
})

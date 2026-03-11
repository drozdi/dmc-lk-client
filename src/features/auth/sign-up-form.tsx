import { useStoreAuth, useStoreUserProfile } from "@/entites/auth";
import {
	type BoxProps,
	Box,
	Button,
	PasswordInput,
	Stack,
	TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

const fieldsSchema = yup.object().shape({
	first_name: yup.string().required("Заполните имя"),
	last_name: yup.string().required("Заполните фамилию"),
	father_name: yup.string().required("Заполните отчество"),
	email: yup
		.string()
		.email("Введите корректный email")
		.required("Заполните email"),
	phone: yup
		.string()
		.matches(
			/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
			"Неверный номер телефона",
		)
		.required("Заполните телефон"),
	password: yup
		.string()
		.required("Пароль обязателен.")
		/*.matches(
			/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]/,
			'Допустимые символы: буквы, цифры и спец. символы @#$%^&*'
		)*/
		.min(6, "Должно быть не меньше 6 символов")
		.max(16, "Должно быть не больше 16 символов"),
	re_password: yup
		.string()
		.required("Повтор пароль обязателен.")
		.oneOf([yup.ref("password")], "Пароли должны совпадать!"),
});

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

interface SignUpFormProps extends BoxProps {}

export const SignUpForm = (props: SignUpFormProps) => {
	const storeAuth = useStoreAuth();
	const storeUserProfile = useStoreUserProfile();
	const form = useForm<Partial<IUserPassword>>({
		mode: "uncontrolled",
		name: "signUp",
		initialValues: {
			first_name: "",
			last_name: "",
			father_name: "",
			email: "",
			phone: "",
			password: "",
			re_password: "",
		},
		validate: yupResolver(fieldsSchema),
	});
	const { isLoading } = storeAuth;
	const navigate = useNavigate();

	async function sendFormData(formData: Partial<IUserPassword>) {
		const res = await storeAuth.register(formData);
		storeUserProfile.setUserData(res.user);
		if (res) {
			navigate("/", { replace: true });
		}
	}

	return (
		<Box {...props}>
			<Stack>
				<TextInput
					placeholder="Имя"
					type="text"
					required
					{...form.getInputProps("first_name")}
				/>
				<TextInput
					placeholder="Фамилия"
					type="text"
					required
					{...form.getInputProps("last_name")}
				/>
				<TextInput
					placeholder="Отчество"
					type="text"
					required
					{...form.getInputProps("father_name")}
				/>
				<TextInput
					placeholder="Email"
					type="email"
					required
					{...form.getInputProps("email")}
				/>

				<TextInput
					placeholder="Телефон"
					type="phone"
					required
					{...form.getInputProps("phone")}
				/>

				<PasswordInput
					placeholder="Придумай пароль"
					type="password"
					required
					{...form.getInputProps("password")}
				/>
				<PasswordInput
					placeholder="Повтори пароль"
					type="password"
					required
					{...form.getInputProps("re_password")}
				/>

				<Button
					onClick={() => form.onSubmit(sendFormData)()}
					fullWidth
					loading={isLoading}
				>
					Войти
				</Button>
			</Stack>
		</Box>
	);
};

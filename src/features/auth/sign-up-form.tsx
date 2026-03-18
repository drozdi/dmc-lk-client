import { useStoreAuth, useStoreUserProfile } from "@/entites/auth";
import {
	type BoxProps,
	Box,
	Button,
	PasswordInput,
	Stack,
	TextInput,
} from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";

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
		validate: {
			first_name: isNotEmpty("Заполните имя"),
			last_name: isNotEmpty("Заполните фамилию"),
			father_name: isNotEmpty("Заполните отчество"),
			email: isEmail("Введите корректный email"),
			phone: (value) =>
				/^(?:\+?[0-9]{1,4}[\s\-]?[0-9]{2,3}[\s\-]?[0-9]{2,4}[\s\-]?[0-9]{2,4}[\s\-]?[0-9]{2,4})$/.test(
					value || "",
				)
					? null
					: "Неверный телефон",
			password: (value) =>
				(value || "").length < 5
					? "Должно быть не меньше 6 символов"
					: /(?:.*[0-9])(?:.*[a-zA-Z])(?=.*[$&+,:;=?@#|'<>.^*()%!-])(?:.*)/.test(
								value,
						  )
						? null
						: `Допустимые символы: буквы, цифры и спец. символы $&+,:;=?@#|'<>.^*()%!-`,
			re_password: (value, values) =>
				value !== values.password ? "Пароли не совпадают" : null,
		},
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
					placeholder="Фамилия"
					type="text"
					required
					{...form.getInputProps("last_name")}
				/>
				<TextInput
					placeholder="Имя"
					type="text"
					required
					{...form.getInputProps("first_name")}
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
					Зарегистрироваться
				</Button>
			</Stack>
		</Box>
	);
};

import { useStoreUserProfile } from "@/entites/auth";
import { Template } from "@/layout";
import { Loading, PhoneInput } from "@/shared/ui";
import {
	Button,
	Divider,
	Group,
	PasswordInput,
	Stack,
	TextInput,
} from "@mantine/core";
import { isEmail, isNotEmpty, matches, useForm } from "@mantine/form";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const PersonalForm = () => {
	const storeUserProfile = useStoreUserProfile();
	const { isLoading, userData } = storeUserProfile;
	const navigate = useNavigate();
	const form = useForm<Partial<IUser>>({
		mode: "uncontrolled",
		name: "personalForm",
		initialValues: {
			first_name: userData?.first_name || "",
			last_name: userData?.last_name || "",
			father_name: userData?.father_name || "",
			email: userData?.email || "",
			phone: userData?.phone || "",
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
		},

		onValuesChange: (values) => {
			storeUserProfile.setUserData(values);
		},
	});
	const formPassword = useForm<{
		oldPassword: string;
		newPassword: string;
		re_password: string;
	}>({
		mode: "uncontrolled",
		name: "passwordFormPassword",
		initialValues: {
			oldPassword: "",
			newPassword: "",
			re_password: "",
		},
		validate: {
			oldPassword: isNotEmpty("Введите пароль"),
			newPassword: matches(
				/(?:.*[0-9])(?:.*[a-zA-Z])(?=.*[$&+,:;=?@#|'<>.^*()%!-])(?:.*)/,
				"Допустимые символы: буквы, цифры и спец. символы $&+,:;=?@#|'<>.^*()%!-",
			),
			re_password: (value, values) =>
				value !== values.newPassword ? "Пароли должны совпадать!" : null,
		},
	});

	async function handleSave(formData: Partial<IUser>) {
		await storeUserProfile.update(formData);
	}
	async function handleSaveNavigate(formData: Partial<IUser>) {
		await storeUserProfile.update(formData);
		navigate("/");
	}
	async function handleChangePassword({
		oldPassword,
		newPassword,
	}: {
		oldPassword: string;
		newPassword: string;
	}) {
		const res = await storeUserProfile.updatePassword(oldPassword, newPassword);
		if (res) {
			formPassword.setValues({
				oldPassword: "",
				newPassword: "",
				re_password: "",
			});
		}
	}

	const isValid = true;

	useEffect(() => {
		if (userData?.email) {
			form.initialize(userData);
		}
	}, [userData]);

	useEffect(() => {
		storeUserProfile.load();
	}, []);

	return (
		<Loading active={isLoading} keepMounted>
			<Stack component="form">
				<TextInput
					placeholder="Фамилия"
					type="text"
					size="md"
					variant="underline"
					{...form.getInputProps("last_name")}
				/>
				<TextInput
					placeholder="Имя"
					size="md"
					type="text"
					variant="underline"
					{...form.getInputProps("first_name")}
				/>
				<TextInput
					placeholder="Отчество"
					type="text"
					size="md"
					variant="underline"
					{...form.getInputProps("father_name")}
				/>
				<TextInput
					placeholder="Email"
					type="email"
					size="md"
					variant="underline"
					{...form.getInputProps("email")}
				/>
				<PhoneInput
					placeholder="Телефон"
					type="phone"
					required
					variant="underline"
					size="md"
					{...form.getInputProps("phone")}
				/>
				<Divider />
				<PasswordInput
					placeholder="Старый пароль"
					size="md"
					variant="underline"
					{...formPassword.getInputProps("oldPassword")}
				/>
				<PasswordInput
					placeholder="Новый пароль"
					size="md"
					variant="underline"
					{...formPassword.getInputProps("newPassword")}
				/>
				<PasswordInput
					placeholder="Повтори пароль"
					size="md"
					variant="underline"
					{...formPassword.getInputProps("re_password")}
				/>

				<Group justify="end">
					<Button onClick={() => formPassword.onSubmit(handleChangePassword)()}>
						Обновить пароль
					</Button>
				</Group>
				<Template slot="footer">
					<Group>
						<Button
							color="green"
							onClick={() => form.onSubmit(handleSaveNavigate)()}
							loading={isLoading}
							disabled={!isValid}
						>
							Сохранить
						</Button>
						<Button
							onClick={() => form.onSubmit(handleSave)()}
							loading={isLoading}
							disabled={!isValid}
						>
							Применить
						</Button>
					</Group>
				</Template>
			</Stack>
		</Loading>
	);
};

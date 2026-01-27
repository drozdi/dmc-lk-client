import { useStoreAuth } from "@/entites/auth";
import { Loading } from "@/shared/ui";
import { Box, Button, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

export const SignInForm = observer((props) => {
	const storeAuth = useStoreAuth();
	const form = useForm({
		mode: "uncontrolled",
		name: "signUp",
		initialValues: {
			email: "",
			password: "",
		},
	});
	const { isLoading } = storeAuth;
	const navigate = useNavigate();
	const handleSubmit = async ({ email, password }) => {
		const res = await storeAuth.login(email, password);
		if (true === res) {
			navigate("/", { replace: true });
		}
	};

	return (
		<Box {...props}>
			<Stack
				component="form"
				name="signIn"
				onSubmit={form.onSubmit(handleSubmit)}
			>
				<Loading active={isLoading} keepMounted>
					<TextInput
						label="Email"
						placeholder="Email"
						type="email"
						autoComplete="email"
						required
						{...form.getInputProps("email")}
					/>
					<PasswordInput
						label="Пароль"
						placeholder="Пароль"
						type="password"
						autoComplete="current-password"
						required
						{...form.getInputProps("password")}
					/>
				</Loading>
				<Button type="submit" fullWidth loading={isLoading}>
					Войти
				</Button>
			</Stack>
		</Box>
	);
});

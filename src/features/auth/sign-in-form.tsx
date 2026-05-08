import { useStoreAuth } from "@/entites/auth";
import { Loading } from "@/shared/ui";
import {
	type BoxProps,
	Box,
	Button,
	PasswordInput,
	Stack,
	TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";

interface SignInFormProps extends BoxProps {}

export const SignInForm = (props: SignInFormProps) => {
	const storeAuth = useStoreAuth();
	const form = useForm<Partial<IUserInfo>>({
		mode: "uncontrolled",
		name: "signUp",
		initialValues: {
			email: "",
			password: "",
		},
	});
	const { isLoading } = storeAuth;
	const navigate = useNavigate();
	const handleSubmit = async ({ email, password }: Partial<IUserInfo>) => {
		const res = await storeAuth.login(email as string, password as string);
		if (true === res) {
			navigate("/", { replace: true });
		}
	};

	return (
		<Box {...props}>
			<Stack>
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
				<Button
					onClick={() => form.onSubmit(handleSubmit)()}
					fullWidth
					loading={isLoading}
				>
					Войти
				</Button>
			</Stack>
		</Box>
	);
};

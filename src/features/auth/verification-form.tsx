import { useStoreAuth } from "@/entites/auth";
import { api } from "@/shared/api";
import { Button, Notification, Stack, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const VerificationForm = () => {
	const storeAuth = useStoreAuth();
	const [searchParams] = useSearchParams();
	const { isLoading, error } = storeAuth;
	const [link, setLink] = useState<string>(searchParams.get("link") || "");
	const navigate = useNavigate();
	async function handleSubmit(e?: FormEvent<HTMLElement>) {
		e?.preventDefault();
		try {
			const data = await storeAuth.verification(link);
			if (!data.data?.token) {
				return;
			}
			api.setAccessToken(data.data.token);
			api.setRefreshToken("");
			navigate("/auth/sign-up", { replace: true });
		} catch (error) {
			console.error(error);
		}
	}
	useEffect(() => {
		if (searchParams.get("link")) {
			handleSubmit();
		}
	}, []);

	return (
		<>
			{error && (
				<Notification color="red" withCloseButton={false}>
					{error}
				</Notification>
			)}
			<Stack component="form" onSubmit={handleSubmit}>
				<TextInput
					placeholder="Код"
					id="link-code"
					name="link"
					type="text"
					value={link}
					onChange={(e) => setLink(e.target.value)}
					required
				/>

				<Button type="submit" fullWidth loading={isLoading}>
					Продолжить
				</Button>
			</Stack>
		</>
	);
};

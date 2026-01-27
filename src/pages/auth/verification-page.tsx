import { VerificationForm } from "@/features/auth/verification-form";
import { Stack, Title } from "@mantine/core";

export function VerificationPage() {
	return (
		<Stack>
			<Title ta="center" order={1}>
				Проверка
			</Title>
			<VerificationForm />
		</Stack>
	);
}

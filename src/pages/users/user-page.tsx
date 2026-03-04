import { UserForm } from "@/features/users/user-form";
import { Template } from "@/layout";
import { Paper } from "@mantine/core";
import { useParams } from "react-router-dom";

export function UsersUserPage() {
	const { userId } = useParams();
	return (
		<Paper>
			<Template.Title>Пользователь</Template.Title>
			<UserForm id={userId} />
		</Paper>
	);
}

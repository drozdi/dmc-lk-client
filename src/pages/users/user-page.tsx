import { UserForm } from "@/features/users/user-form";
import { Paper } from "@mantine/core";
import { Template } from "@t";
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

import { UsersList } from "@/features/users/users-list";
import { Paper } from "@mantine/core";
import { Template } from "@t";
export function UsersListPage() {
	return (
		<Paper>
			<Template.Title fz="h2" ta="center">
				Пользователи
			</Template.Title>
			<UsersList />
		</Paper>
	);
}

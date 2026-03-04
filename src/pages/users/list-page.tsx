import { UsersList } from "@/features/users/users-list";
import { Template } from "@/layout";
import { Paper } from "@mantine/core";
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

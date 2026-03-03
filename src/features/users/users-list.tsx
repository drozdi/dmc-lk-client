import { useQueryUsersDelete, useQueryUsersList } from "@/entites/users";
import { $setting } from "@/shared";
import { Template } from "@/shared/layout";
import { notification } from "@/shared/notification";
import { Loading } from "@/shared/ui";
import { Button, Group, NavLink, Paper, Select, Text } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";

interface UsersListProps {
	className?: string;
}
export function UsersList({ className }: UsersListProps) {
	const [size, setSize] = $setting.useState<number>(
		"users.size",
		$setting.get("size"),
	);
	const deleteQuery = useQueryUsersDelete();
	const {
		isLoading,
		error,
		data,
		hasPreviousPage,
		hasNextPage,
		fetchNextPage,
		fetchPreviousPage,
	} = useQueryUsersList({
		size,
	});

	const navigate = useNavigate();

	if (error?.response?.data?.detail === "Unsupported token type") {
		navigate("/");
		notification.error("Нет прав!");
		return;
	}

	const handleRemove = async (item: IUsersUser) => {
		if (!confirm(`Точно хотите удалить пользователя "${item.email}"?`)) {
			return;
		}
		await deleteQuery.mutate(item);
	};

	return (
		<Paper>
			<Loading active={isLoading} keepMounted>
				{data?.length ? (
					data.map((item) => (
						<NavLink
							component={Link}
							to={`/users/${item.id}`}
							key={item.id}
							label={`
								${[item.last_name, item.first_name, item.father_name].join(
									" ",
								)} (${item.email})`}
						/>
					))
				) : (
					<Text fz="h2" ta="center">
						Пользователи не найдены
					</Text>
				)}
			</Loading>

			<Template.Footer>
				<Group>
					<Button
						disabled={!hasPreviousPage}
						onClick={() => fetchPreviousPage()}
					>
						Предыдущая
					</Button>
					<Button
						disabled={!hasNextPage}
						onClick={() => fetchNextPage()}
					>
						Следующая
					</Button>
				</Group>
				<Select
					value={String(size)}
					onChange={(value) => {
						setSize(Number(value));
					}}
					data={$setting.get("limits")}
				/>
			</Template.Footer>
		</Paper>
	);
}

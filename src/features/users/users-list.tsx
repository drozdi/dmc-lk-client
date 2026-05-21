import { useQueryUsersDelete, useQueryUsersList } from "@/entites/users";
import { Template } from "@/layout";
import { $setting } from "@/shared";
import { notification } from "@/shared/notification";
import { ButtonRemove, DataColumn, TableData } from "@/shared/ui";
import {
	Box,
	Button,
	Card,
	Group,
	Paper,
	Select,
	SimpleGrid,
	Text
} from "@mantine/core";
import { TbCircleMinus } from "react-icons/tb";
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
		goToNext,
		goToPrevious,
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
			<TableData<IUsersUser> 
				data={data} breakpoint="sm"
				noDataText='Пользователи не найдены' 
				withPagination={false} loading={isLoading} 
				layout={({nodes, colums}) => <SimpleGrid cols={2}>
					{nodes.map((item) => <Card key={item.index} withBorder>
						<Group
							justify="space-between" 
							align="flex-start"
							wrap="nowrap"
							grow>
							<Box flex='1' maw='80%'>
								<Text truncate='end'>
									{[item.data.last_name, item.data.first_name, item.data.father_name].join(" ")}
								</Text>
								<Text truncate='end' fz='xs' opacity={0.7}>
									{item.data.email}
								</Text>
							</Box>
							<Box flex='0'>
								<ButtonRemove
									tooltip="Удалить"
									loading={deleteQuery.isPending}
									onClick={(event) => {
										event.stopPropagation();
										event.preventDefault();
										handleRemove(item.data);
									}}
								>
									<TbCircleMinus />
								</ButtonRemove>
							</Box>
						</Group>
					</Card>
					)}
				</SimpleGrid>}>
				<DataColumn<IUsersUser> field='.' body={(item, column) => <Link to={`/users/${item.id}`}>
					{[item.last_name, item.first_name, item.father_name].join(" ") + ` (${item.email})`}
				</Link>
				} />
				<DataColumn<IUsersUser> 
					field='.actions' 
					style={(column, item) => {
						if (item.index) {
							return {
								textAlign: "right",
							}
						}
						return {}
					}} 
					body={(item, column) => <ButtonRemove
						tooltip="Удалить"
						loading={deleteQuery.isPending}
						onClick={(event) => {
							event.stopPropagation();
							event.preventDefault();
							handleRemove(item);
						}}
					>
						<TbCircleMinus />
					</ButtonRemove>
				} />
			</TableData>
			<Template.Footer>
				<Group>
					<Button disabled={!hasPreviousPage} onClick={() => goToPrevious()}>
						Предыдущая
					</Button>
					<Button disabled={!hasNextPage} onClick={() => goToNext()}>
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

import { Template } from "@/shared/layout";
import { notification } from "@/shared/notification";
import { Loading } from "@/shared/ui";
import {
	Button,
	Group,
	NavLink,
	Notification,
	Paper,
	Select,
	Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFetchUsers } from "../../apps/users/api";

interface UsersListProps {
	className?: string;
}
export function UsersList({ className }: UsersListProps) {
	const navigate = useNavigate();
	const [list, setList] = useState<IUsersUser[]>([]);
	const [size, setSize] = useState<number>(30);
	const [number, setNumber] = useState<number>(0);
	const { isLoading, error, data } = useFetchUsers({
		number,
		size: Number(size),
	});

	if (error?.response?.data?.detail === "Unsupported token type") {
		navigate("/");
		notification.error("Нет прав!");
		return;
	}

	useEffect(() => {
		setList(Array.isArray(data) ? data : []);
	}, [data]);

	return (
		<Paper>
			<Loading active={isLoading} keepMounted>
				{list.length > 0 ? (
					list.map((item) => (
						<NavLink
							component={Link}
							to={`/users/${item.id}`}
							key={item.id}
							label={[
								item.last_name,
								item.first_name,
								item.father_name,
							].join(" ")}
						/>
					))
				) : (
					<Text fz="h2" ta="center">
						Пользователи не найдены
					</Text>
				)}
			</Loading>

			<Template slot="notification">
				{error && (
					<Notification color="red">{error as any}</Notification>
				)}
			</Template>
			<Template.Footer>
				<Group>
					<Button disabled={number != 1}>Предыдущая</Button>
					<Button disabled={list.length < Number(size)}>
						Следующая
					</Button>
				</Group>
				<Select
					value={String(size)}
					onChange={(value) => {
						setNumber(0);
						setSize(Number(value));
					}}
					data={["15", "30", "50", "75", "100"]}
				/>
			</Template.Footer>
		</Paper>
	);
}

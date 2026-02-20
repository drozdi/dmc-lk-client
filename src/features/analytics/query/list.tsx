import { useQueryQueryDelete, useQueryQueryList } from "@/entites/analytics";
import { $setting } from "@/shared";
import { Item, ItemLabel, ItemSection, List, Loading } from "@/shared/ui";
import { ActionIcon, Button, Group, Select, Stack, Text } from "@mantine/core";
import { Template } from "@t";
import { TbCircleMinus } from "react-icons/tb";
import { Link as LinkRouter } from "react-router-dom";

interface ListQueriesProps {
	className?: string;
}

export const AnalyticsQueryList = ({ className }: ListQueriesProps) => {
	const [size, setSize] = $setting.useState<number>("query.size", 100);
	const {
		data,
		hasPreviousPage,
		hasNextPage,
		isFetchingPreviousPage,
		isFetchingNextPage,
		fetchNextPage,
		fetchPreviousPage,
		isLoading,
		error,
	} = useQueryQueryList({
		size,
	});

	const deleteQuery = useQueryQueryDelete();

	const handleRemove = async (item: IAnalyticsElastic) => {
		if (!confirm(`Точно хотите удалить "${item.name_query}"?`)) {
			return;
		}
		await deleteQuery.mutate(item);
	};

	return (
		<Stack className={className}>
			<Loading active={isLoading || deleteQuery.isPending} keepMounted>
				<List separator>
					{(data || []).length > 0 ? (
						(data || []).map((item: IAnalyticsElastic) => (
							<Item
								dense
								key={item.id}
								component={LinkRouter}
								to={`/analytics/${item.id}`}
								hoverable
							>
								<ItemSection row top>
									<ItemLabel>{item.name_query}</ItemLabel>
								</ItemSection>
								<ItemSection side>
									<ActionIcon
										color="red"
										title="Удалить"
										loading={deleteQuery.isPending}
										onClick={(event) => {
											event.stopPropagation();
											event.preventDefault();
											handleRemove(item);
										}}
									>
										<TbCircleMinus />
									</ActionIcon>
								</ItemSection>
							</Item>
						))
					) : (
						<Text fz="h2" ta="center" c="dimmed">
							Запросов не существует
						</Text>
					)}
				</List>
			</Loading>
			<Template.Footer>
				<Button component={LinkRouter} to="/analytics/elastic">
					Добавить
				</Button>
				<Group>
					<Button
						disabled={!hasPreviousPage}
						loading={isFetchingPreviousPage}
						onClick={() => fetchPreviousPage()}
					>
						Предыдущая
					</Button>
					<Button
						disabled={!hasNextPage}
						loading={isFetchingNextPage}
						onClick={() => fetchNextPage()}
					>
						Следующая
					</Button>
				</Group>
				<Select
					value={String(size)}
					onChange={(val) => setSize(Number(val))}
					data={["15", "30", "50", "75", "100"]}
				/>
			</Template.Footer>
		</Stack>
	);
};

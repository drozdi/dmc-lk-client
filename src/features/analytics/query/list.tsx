import { useQueryQueryDelete, useQueryQueryList } from "@/entites/analytics";
import { Template } from "@/layout";
import { $setting } from "@/shared";
import { ButtonRemove, DataColumn, TableData } from "@/shared/ui";
import { Button, Group, Select, Stack } from "@mantine/core";
import { TbCircleMinus } from "react-icons/tb";
import { Link } from "react-router-dom";

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
		goToNext,
		goToPrevious,
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
			<TableData<IAnalyticsElastic> noDataText='Запросов не существует' data={data} loading={isLoading || deleteQuery.isPending} withPagination={false}>
				<DataColumn<IAnalyticsElastic> field='name_query' body={(item, column) => <Link to={`/analytics/${item.id}`}>
					{item.name_query}
				</Link>} />
				<DataColumn<IAnalyticsElastic> 
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
						}}>
						<TbCircleMinus />
					</ButtonRemove>} 
				/>
			</TableData>
			<Template.Footer>
				<Button component={Link} to="/analytics/elastic">
					Добавить
				</Button>
				<Group>
					<Button
						disabled={!hasPreviousPage}
						loading={isFetchingPreviousPage}
						onClick={() => goToPrevious()}
					>
						Предыдущая
					</Button>
					<Button
						disabled={!hasNextPage}
						loading={isFetchingNextPage}
						onClick={() => goToNext()}
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

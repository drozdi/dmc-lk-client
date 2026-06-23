import {
	useQueryAnalyticsFields,
	useQueryQueryCreate,
	useQueryQueryUpdate,
} from "@/entites/analytics";
import {
	selectIsNext,
	selectIsPrev,
	useStoreElastic,
} from "@/entites/analytics/stores/use-store-elastic";
import { Template } from "@/layout";
import { DataColumn, TableData } from "@/shared/ui/table";
import {
	Button,
	Divider,
	Group,
	Select,
	Stack
} from "@mantine/core";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ElasticField } from "./components/field";
import { ElasticFilter } from "./components/fliter";

interface AnalyticsElasticTableProps {
	className?: string;
}

export const AnalyticsElasticTable = ({
	className,
}: AnalyticsElasticTableProps) => {
	const navigate = useNavigate();

	const { findLabelByCode } = useQueryAnalyticsFields();

	const newQuery = useQueryQueryCreate();
	const updateQuery = useQueryQueryUpdate();
	const storeElastic = useStoreElastic();

	const { template, data, isLoading } = storeElastic;

	const isNext = selectIsNext(storeElastic);
	const isPrev = selectIsPrev(storeElastic);
	const limit = storeElastic.getLimit();

	const update = () => storeElastic.save({ ...template });

	const columns = useMemo(
		() => [
			...(template.company?.select_field || []).map((item) => ({
				accessorKey: item,
				header: findLabelByCode(item),
			})),
		],
		[template, findLabelByCode],
	);

	const handleDelSelect = (select: string) => {
		template.company.select_field = template.company.select_field.filter(
			(item) => item !== select,
		);
		update();
	};

	const handleSave = async () => {
		let name_query = storeElastic.name_query || undefined;
		if (!name_query) {
			name_query = prompt("Введите название запроса") || undefined;
		}
		if (name_query) {
			storeElastic.setNameQuery(name_query);
			if (storeElastic.id) {
				updateQuery.mutate({
					...storeElastic.template,
					id: storeElastic.id,
					name_query,
				});
			} else {
				const res = await newQuery.mutateAsync({
					...storeElastic.template,
					name_query,
				});
				navigate(`/analytics/${res.id}`, {
					replace: true,
				});
			}
		}
	};

	return (
		<>
			<Group className={className} justify="space-between" align="self-start">
				<ElasticField />
				<Divider orientation="vertical" mx="lg" />
				<ElasticFilter flex="1" />
				<Stack>
					<Button
						color="green"
						onClick={handleSave}
						loading={newQuery.isPending || updateQuery.isPending}
					>
						Сохранить
					</Button>
					<Button onClick={() => storeElastic.reset()} loading={isLoading}>
						Применить
					</Button>
				</Stack>
			</Group>


			<TableData<IAnalyticsElasticItem> data={data} withPagination={false} loading={isLoading} limit={limit}>
				{columns?.length ? columns.map((column) => (
					<DataColumn<IAnalyticsElasticItem> field={column.accessorKey} header={column.header} toggleable={(column) => handleDelSelect(column.field)} ellipsis noWrap />
				)): <DataColumn<IAnalyticsElasticItem> field='.' header='Выберите что паказавать' style={{
					textAlign: 'center',
					fontSize: '3rem'
				}} />}
			</TableData>

			<Template.Footer>
				<Group>
					<Button
						loading={isLoading}
						disabled={!isPrev}
						onClick={() => storeElastic.prev()}
					>
						Предыдущая
					</Button>
					<Button
						loading={isLoading}
						disabled={!isNext}
						onClick={() => storeElastic.next()}
					>
						Следующая
					</Button>
				</Group>
				<Select
					value={String(limit)}
					data={["15", "30", "50", "75", "100"]}
					onChange={(value) => storeElastic.setLimit(Number(value))}
				/>
			</Template.Footer>
		</>
	);
};

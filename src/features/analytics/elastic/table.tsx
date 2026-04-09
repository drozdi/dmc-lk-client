import {
	SelectActions,
	SelectAnalyticsFields,
	SelectSingleAction,
	useQueryAnalyticsFields,
	useQueryQueryCreate,
	useQueryQueryUpdate,
} from "@/entites/analytics";
import { useStoreElastic } from "@/entites/analytics/stores/use-store-elastic";
import { Template } from "@/layout";
import { ButtonRemove, Loading } from "@/shared/ui";
import {
	Button,
	Group,
	Select,
	Stack,
	Table,
	TagsInput,
	Text,
	TextInput,
	Tooltip,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { TbColumnRemove } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

interface AnalyticsElasticTableProps {
	className?: string;
}

type TypeField = "field" | "main";

export const AnalyticsElasticTable = ({
	className,
}: AnalyticsElasticTableProps) => {
	const navigate = useNavigate();
	const qaf = useQueryAnalyticsFields();
	const newQuery = useQueryQueryCreate();
	const updateQuery = useQueryQueryUpdate();
	const storeElastic = useStoreElastic();

	const { template, data, isNext, isPrev, limit, date, isLoading } =
		storeElastic;

	const columns = useMemo(
		() => [
			...(template.company?.select_field || []).map((item) => ({
				accessorKey: item,
				header: qaf.findLabelByCode(item),
			})),
		],
		[template, qaf.findLabelByCode],
	);

	const canEdit = (column: { accessorKey: string; type: TypeField }) => {
		return column.type !== "main";
	};

	const table = useReactTable({
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
	});

	const whereItem = (select: string) =>
		template.company.list_where?.find(
			(item) => item.name_field_table === select,
		);

	const whereItemAppend = (
		select: string,
		sign: PermittedActions,
		value: string | string[] = "",
		action: SingleActionList = "and",
	) => {
		const index = template.company.list_where?.findIndex(
			(item) => item.name_field_table === select,
		) as number;
		let where = {
			name_field_table: select,
			sing_action: sign,
			search_value: value,
			single_action_list: action,
		};
		if (index === -1) {
			template.company.list_where?.push(where);
		} else {
			where = template.company.list_where?.[index] as any;
		}
		return where;
	};

	const handleAddField = (select: string) => {
		if (!select) {
			return;
		}
		template.company.select_field.push(select);
		storeElastic.save({ ...template });
	};
	const handleRemoveField = (select: string) => {
		template.company.select_field = template.company.select_field.filter(
			(item) => item !== select,
		);
		template.company.list_where = template.company.list_where?.filter(
			(item) => item.name_field_table !== select,
		);
		storeElastic.save({ ...template });
	};
	const handleChangeActionField = (
		select: string,
		action: SingleActionList,
	) => {
		const where = whereItemAppend(select, "=", "", action);
		where.single_action_list = action;
		storeElastic.save({ ...template });
	};
	const handleChangeSignField = (select: string, sign: PermittedActions) => {
		const where = whereItemAppend(select, sign);
		where.sing_action = sign;
		where.search_value = "";
		storeElastic.save({ ...template });
	};
	const handleChangeInField = (select: string, value: string[]) => {
		const where = whereItemAppend(select, "=", value);
		where.search_value = value;
		storeElastic.save({ ...template });
	};
	const handleChangeValueField = (select: string, value: string) => {
		const where = whereItemAppend(select, "=", value);
		where.search_value = value;
		storeElastic.save({ ...template });
	};
	const handleDateChange = (name: string, value: any) => {
		storeElastic.setDate({
			[name]: value,
		});
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

	/*const computedColumns = useMemo(
		() =>
			Object.entries(qaf.data || {}).map(([key, item]) => ({
				accessor: key,
				title: item.label,
				ellipsis: true,
				noWrap: true,
				sortKey: key,
				// resizable: true,
				// sortable: true,
				toggleable: true,
				defaultToggle: false,
				// filter: ({ close }) => {
				// 	return <></>;
				// },
				// draggable: true,
			})),
		[qaf.data, qaf.findLabelByCode],
	);*/

	// useEffect(() => {
	// 	if (storeElastic.id) {
	// 		storeElastic.reset();
	// 	}
	// }, [storeElastic.id]);

	return (
		<>
			<Group className={className} justify="space-between">
				<Stack>
					<Group>
						<Text>С</Text>
						<DatePickerInput
							name="date_from"
							value={date?.date_from}
							onChange={(value) => handleDateChange("date_from", value)}
						/>
						<Text>по</Text>
						<DatePickerInput
							name="date_to"
							value={date?.date_to}
							onChange={(value) => handleDateChange("date_to", value)}
						/>
					</Group>
					<SelectAnalyticsFields
						flex="1"
						value={""}
						excludeds={columns.map((item) => item.accessorKey)}
						onChange={(value) => handleAddField(value as string)}
						placeholder="Добавить поле"
					/>
				</Stack>
				<Stack mt="xs" flex="1">
					{(template.company.list_where || []).map((item, index) => (
						<Group key={index}>
							<Text>{qaf.findLabelByCode(item.name_field_table)}</Text>
							<SelectActions
								flex="1"
								value={item.sing_action || "="}
								includes={qaf.findActionByCode(item.name_field_table)}
								onChange={(sing_action) =>
									handleChangeSignField(
										item.name_field_table,
										sing_action as PermittedActions,
									)
								}
							/>
							{item.sing_action === "in" || item.sing_action === "not_in" ? (
								<TagsInput
									value={item.search_value as string[]}
									onChange={(value) =>
										handleChangeInField(item.name_field_table, value)
									}
									placeholder="Enter поиск"
								/>
							) : (
								<TextInput
									value={item.search_value as string[]}
									onChange={({ target }) =>
										handleChangeValueField(item.name_field_table, target.value)
									} ///
								/>
							)}
							<SelectSingleAction
								flex="0"
								value={item.single_action_list || "and"}
								onChange={(single_action_list) =>
									handleChangeActionField(
										item.name_field_table,
										single_action_list as SingleActionList,
									)
								}
							/>
							<ButtonRemove />
						</Group>
					))}
					<SelectAnalyticsFields
						flex="1"
						value={""}
						onChange={(value) => handleAddField(value as string)}
						placeholder="Добавить поле"
					/>
				</Stack>
			</Group>

			<Loading active={isLoading} keepMounted>
				<Table striped withColumnBorders mt="xs">
					<Table.Thead>
						{columns?.length ? (
							table.getHeaderGroups().map((headerGroup, index) => (
								<Table.Tr key={headerGroup.id + "-" + index}>
									{headerGroup.headers.map((header) => (
										<Table.Th key={header.id} colSpan={header.colSpan}>
											<Group justify="space-between" grow>
												<Text>
													{header.isPlaceholder
														? null
														: flexRender(
																header.column.columnDef.header,
																header.getContext(),
															)}
												</Text>
												<ButtonRemove
													flex="0"
													tooltip="Удалить поле"
													size="xs"
													onClick={() => handleRemoveField(header.id)}
												>
													<TbColumnRemove />
												</ButtonRemove>
											</Group>
										</Table.Th>
									))}
								</Table.Tr>
							))
						) : (
							<Table.Tr>
								<Table.Th ta="center" fz="h2" c="dimmed">
									Выберите столбцы
								</Table.Th>
							</Table.Tr>
						)}
					</Table.Thead>
					<Table.Tbody>
						{table.getRowModel().rows.map((row) => (
							<Tooltip key={row.id} label={`Ошибка #${row.original.id}`}>
								<Table.Tr>
									{row.getVisibleCells().map((cell, index) => (
										<Table.Td key={cell.id + "-" + index}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</Table.Td>
									))}
								</Table.Tr>
							</Tooltip>
						))}
					</Table.Tbody>
				</Table>
			</Loading>
			<Template.Footer>
				<Group>
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
				</Group>
				<Group>
					<Button
						loading={isLoading}
						disabled={!storeElastic.isPrev}
						onClick={() => storeElastic.prev()}
					>
						Предыдущая
					</Button>
					<Button
						loading={isLoading}
						disabled={!storeElastic.isNext}
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

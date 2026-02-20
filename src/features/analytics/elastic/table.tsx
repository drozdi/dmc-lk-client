import {
	useQueryAnalyticsFields,
	useQueryQueryCreate,
	useQueryQueryUpdate,
} from "@/entites/analytics";
import { useStoreElastic } from "@/entites/analytics/stores/use-store-elastic";
import { ButtonIcon, ButtonRemove, Loading } from "@/shared/ui";
import {
	Button,
	Group,
	Popover,
	Select,
	Stack,
	Table,
	Text,
	TextInput,
	Tooltip,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Template } from "@t";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo } from "react";
import { TbColumnRemove } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { ActionForm } from "./components/action-form";
import { InForm } from "./components/in-form";
import { SignForm } from "./components/sign-form";

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
			// {
			// 	accessorKey: "id",
			// 	header: "#",
			// 	type: "main",
			// },
			...(template.company?.select_field || []).map((item) => ({
				accessorKey: item,
				header: qaf.findLabelByCode(item),
				type: "field",
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
		console.log(select, action);
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

	useEffect(() => {
		if (storeElastic.id) {
			storeElastic.reset();
		}
	}, [storeElastic.id]);

	return (
		<>
			<Group className={className} justify="space-between">
				<Group>
					<Text>С</Text>
					<DatePickerInput
						name="date_from"
						value={date?.date_from}
						onChange={(value) =>
							handleDateChange("date_from", value)
						}
					/>
					<Text>по</Text>
					<DatePickerInput
						name="date_to"
						value={date?.date_to}
						onChange={(value) => handleDateChange("date_to", value)}
					/>
				</Group>
				<Select
					flex="1"
					value={""}
					onChange={(value) => handleAddField(value as string)}
					placeholder="Добавить поле"
					data={qaf.dataSelect}
				/>
			</Group>
			<Loading active={isLoading} keepMounted>
				<Table striped withColumnBorders mt="xs">
					<Table.Thead>
						{table.getHeaderGroups()[0]?.headers?.length ? (
							table
								.getHeaderGroups()
								.map((headerGroup, index) => (
									<Table.Tr
										key={headerGroup.id + "-" + index}
									>
										{headerGroup.headers.map(
											(header: any, index) => (
												<Table.Th
													key={
														header.id + "-" + index
													}
													colSpan={header.colSpan}
												>
													<Group
														justify="space-between"
														grow
													>
														<Text>
															{header.isPlaceholder
																? null
																: flexRender(
																		header
																			.column
																			.columnDef
																			.header,
																		header.getContext(),
																	)}
														</Text>
														{canEdit(
															header.column
																.columnDef,
														) && (
															<Group justify="end">
																<Popover>
																	<Popover.Target>
																		<ButtonIcon>
																			tb-settings
																		</ButtonIcon>
																	</Popover.Target>
																	<Popover.Dropdown w="18rem">
																		<Stack gap="xs">
																			<Group justify="space-between">
																				<ActionForm
																					flex="1"
																					value={
																						whereItem(
																							header.id,
																						)
																							?.single_action_list ||
																						"and"
																					}
																					onChange={(
																						single_action_list,
																					) =>
																						handleChangeActionField(
																							header.id,
																							single_action_list as SingleActionList,
																						)
																					}
																				/>

																				<SignForm
																					flex="1"
																					value={
																						whereItem(
																							header.id,
																						)
																							?.sing_action ||
																						"="
																					}
																					onChange={(
																						sing_action,
																					) =>
																						handleChangeSignField(
																							header.id,
																							sing_action as PermittedActions,
																						)
																					}
																				/>
																			</Group>
																			{whereItem(
																				header.id,
																			)
																				?.sing_action ===
																				"in" ||
																			whereItem(
																				header.id,
																			)
																				?.sing_action ===
																				"not_in" ? (
																				<InForm
																					values={
																						whereItem(
																							header.id,
																						)
																							?.search_value as string[]
																					}
																					onChange={(
																						values,
																					) =>
																						handleChangeInField(
																							header.id,
																							values,
																						)
																					}
																				/>
																			) : (
																				<TextInput
																					value={
																						whereItem(
																							header.id,
																						)
																							?.search_value as string[]
																					}
																					onChange={({
																						target,
																					}) =>
																						handleChangeValueField(
																							header.id,
																							target.value,
																						)
																					} ///
																				/>
																			)}
																		</Stack>
																	</Popover.Dropdown>
																</Popover>
																<ButtonRemove
																	onClick={() =>
																		handleRemoveField(
																			header.id,
																		)
																	}
																	title="Удалить поле"
																>
																	<TbColumnRemove />
																</ButtonRemove>
															</Group>
														)}
													</Group>
												</Table.Th>
											),
										)}
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
							<Tooltip
								key={row.id}
								label={`Ошибка #${row.original.id}`}
							>
								<Table.Tr>
									{row
										.getVisibleCells()
										.map((cell, index) => (
											<Table.Td
												key={cell.id + "-" + index}
											>
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
					<Button
						onClick={() => storeElastic.reset()}
						loading={isLoading}
					>
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

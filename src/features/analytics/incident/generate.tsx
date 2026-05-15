import {
	SelectAnalyticsIncidentFields,
	useEnumsFields,
	useQueryIncident
} from "@/entites/analytics";
import { $setting } from "@/shared";
import { useQueryLoading } from "@/shared/hooks";
import { ButtonIcon, ButtonRemove, DataTable, Loading } from "@/shared/ui";
import {
	ActionIcon,
	Center,
	Group,
	HoverCard,
	Stack,
	Text,
	TextInput
} from "@mantine/core";
import { type DateValue } from "@mantine/dates";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { TbColumnRemove, TbPlus, TbReload, TbXboxX } from "react-icons/tb";

import { type DataTableColumn } from "mantine-datatable";

interface IncidentGenerateProps {
	filterdate: [DateValue, DateValue];
	filter?: boolean;
	fields?: string[];
}

export const IncidentGenerate = ({
	filterdate,
	filter,
	fields = [
		"taskid",
		"name_production",
		"address_production",
		"place_name",
		"device_name",
		"node_name",
	],
}: IncidentGenerateProps) => {
	const [template, updateTemplate] = $setting.useSetState<
		Required<IRequestAnalyticsIncident>
	>("incident.table", {
		filterdate,
		data: [],
		fields_name: fields,
	});

	const ef = useEnumsFields();
	const qi = useQueryIncident(template)
	const isLoading = useQueryLoading(qi, ef);
	const { data, fetch } = qi;

	const handleRemove = (field: string) => {
		template.fields_name = template.fields_name.filter(
			(item) => item !== field,
		);
		updateTemplate({ ...template });
	};

	const computedColumns = useMemo(
		() =>
			[
				{
					accessor: "data",
					title: "Ошибка",
					sortKey: "data",
					sortable: true,
				},
				{
					accessor: "total_counter",
					title: "Всего ошибок",
					sortKey: "total_counter",
					sortable: true,
				},
			].concat(
				...(template.fields_name || []).map((field) => ({
					accessor: field,
					title: (
						<HoverCard position="top-end">
							<HoverCard.Target>
								<Text fz='sm'>{ef.findLabelByCode(field)}</Text>
							</HoverCard.Target>
							<HoverCard.Dropdown>
								<ButtonRemove
									tooltip="Удалить"
									onClick={() => handleRemove(field)}
								>
									<TbColumnRemove />
								</ButtonRemove>
								</HoverCard.Dropdown>
							</HoverCard>
					),
					sortKey: field,
					sortable: true,
					ellipsis: false,
					noWrap: false,
				})) as DataTableColumn<IAnalyticsIncidentItem>,
				{
					accessor: "actions",
					title: (
						<HoverCard>
							<HoverCard.Target>
								<ButtonIcon
									tooltip="Сбросить"
									onClick={() =>
										updateTemplate({
											fields_name: fields,
										})
									}
								>
									<TbReload />
								</ButtonIcon>
							</HoverCard.Target>
							<HoverCard.Dropdown>
								<SelectAnalyticsIncidentFields
									excludeds={template.fields_name}
									placeholder="Показывать поля"
									value=""
									onChange={(val) => handleAddField(val as string)}
								/>
							</HoverCard.Dropdown>
						</HoverCard>
					),
					width: 40,
					textAlign: "right",
					titleStyle: {
						backgroundColor: "var(--mantine-color-body)",
					},
					render: (record) => "",
				},
			),
		[template, ef.findLabelByCode],
	);

	const handleAddField = (field: string) => {
		template.fields_name.push(field);
		updateTemplate({ ...template });
	};

	const [value, setValue] = useState("");
	
	const handleKeyPress = ({ key }: React.KeyboardEvent) => {
		if (key === "Enter" && value) {
			template.data.push(value);
			updateTemplate({ ...template });
			setValue("");
		}
	};
	const handleAddData = () => {
		if (value) {
			template.data.push(value);
			updateTemplate({ ...template });
			setValue("");
		}
	};
	const handleRemoveItem = (value: string) => {
		template.data = template.data.filter((item) => value !== item);
		updateTemplate({ ...template });
	};

	useEffect(() => {
		if (filterdate[0] && filterdate[1]) {
			updateTemplate({ filterdate });
		}
	}, [filterdate]);

	useEffect(() => {
		fetch(template)
	}, [template])

	return (
		<Stack gap="xs">
			{/* <br />
			<MantineDataTable columns={
				['name', 'missionStatement', 'streetAddress', 'city', 'state', 'state1', 'state2', 'state3'].map((field) => ({
					accessor: field,
					sortKey: field,
					sortable: true,
					ellipsis: true,
					noWrap: true,
					titleStyle: {
						color: "red"
					}
				}))
			}
			records={[
				{
					name: "John Doe",
					missionStatement: "Lorem ipsum dolor sit amet",
					streetAddress: "123 Main St",
					city: "Anytown",
					state: "CA",
					state1: "CA",
					state2: "CA",
					state3: "CA",
				}, {
					name: "John Doe",
					missionStatement: "Lorem ipsum dolor sit amet",
					streetAddress: "123 Main St",
					city: "Anytown",
					state: "CA",
					state1: "CA",
					state2: "CA",
					state3: "CA",
				}, {
					name: "John Doe",
					missionStatement: "Lorem ipsum dolor sit amet",
					streetAddress: "123 Main St",
					city: "Anytown",
					state: "CA",
					state1: "CA",
					state2: "CA",
					state3: "CA",
				}, {
					name: "John Doe",
					missionStatement: "Lorem ipsum dolor sit amet",
					streetAddress: "123 Main St",
					city: "Anytown",
					state: "CA",
					state1: "CA",
					state2: "CA",
					state3: "CA",
				}
			]} />
			<br /> */}
			{filter && (
				<Group gap="xs" justify="space-between">
					<ul className="list-none flex-1">
						<li>
							<TextInput
								placeholder="Ошибка"
								value={value}
								onChange={({ target }) => setValue(target.value)}
								onKeyPress={handleKeyPress}
								rightSection={
									<ActionIcon onClick={handleAddData}>
										<TbPlus />
									</ActionIcon>
								}
							/>
						</li>
						{template.data.map((item) => (
							<li className="flex justify-between items-start" key={item}>
								{item}{" "}
								<ButtonRemove
									onClick={() => handleRemoveItem(item)}
									title="Удалить ошибку"
								>
									<TbXboxX />
								</ButtonRemove>
							</li>
						))}
					</ul>
				</Group>
			)}
			<Loading active={isLoading} keepMounted>
				{data?.length ? (
					<DataTable<IAnalyticsIncidentItem>
						withRowBorders={false}
						striped
						miw={640}
						pinLastColumn
						columns={computedColumns}
						records={data}
						style={{width: '100%', minWidth: '100%'}}
					/>
				) : (
					<Center w="100%" h="10rem" fz="h1" c="dimmed">
						Данные отсутствуют за период{" "}
						{dayjs(filterdate[0]).format($setting.get("formatDate"))} -{" "}
						{dayjs(filterdate[1]).format($setting.get("formatDate"))}
					</Center>
				)}
			</Loading>
		</Stack>
	);
};

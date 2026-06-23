import {
	SelectAnalyticsIncidentFields,
	useEnumsFields,
	useQueryIncident
} from "@/entites/analytics";
import { IncidentEmpty } from "@/features/analytics/incident/ui/incident-empty";
import {
	exportIncidentDetailed,
} from "@/features/analytics/incident/utils/export-excel";
import { $setting } from "@/shared";
import { useQueryLoading } from "@/shared/hooks";
import { ButtonIcon, ButtonRemove, Loading } from "@/shared/ui";
import { TableSkeleton } from "@/shared/ui/skeleton";
import { DataColumn, TableData } from "@/shared/ui/table";
import {
	ActionIcon,
	Button,
	Group,
	HoverCard,
	Stack,
	TextInput
} from "@mantine/core";
import { type DateValue } from "@mantine/dates";
import { useEffect, useState } from "react";
import { TbDownload, TbPlus, TbReload, TbXboxX } from "react-icons/tb";

interface IncidentGenerateProps {
	filterdate: [DateValue, DateValue];
	filter?: boolean;
	fields?: string[];
	initialDataFilters?: string[];
}

export const IncidentGenerate = ({
	filterdate,
	filter = false,
	fields = [
		"taskid",
		"name_production",
		"address_production",
		"place_name",
		"device_name",
		"node_name",
	],
	initialDataFilters = [],
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
	const { data } = qi;

	const handleRemove = (field: string) => {
		template.fields_name = template.fields_name.filter(
			(item) => item !== field,
		);
		updateTemplate({ ...template });
	};

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
		if (!initialDataFilters.length) {
			return;
		}

		updateTemplate({
			data: [...new Set(initialDataFilters)],
		});
	}, [initialDataFilters]);

	const handleExport = () => {
		if (!data?.length) {
			alert("Нет данных для скачивания");
			return;
		}

		exportIncidentDetailed(
			data,
			template.fields_name,
			ef.findLabelByCode,
			filterdate,
		);
	};

	return (
		<Stack gap="xs">
			<Group justify="space-between">
				{filter ? (
					<Group gap="xs" justify="space-between" flex={1}>
						<ul className="list-none flex-1">
							<li>
								<TextInput
									placeholder="Фильтр по тексту ошибки"
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
				) : (
					<div />
				)}
				<Button
					variant="light"
					leftSection={<TbDownload size={16} />}
					onClick={handleExport}
					disabled={!data?.length}
					loading={isLoading}
				>
					Скачать Excel
				</Button>
			</Group>
			<Loading
				active={isLoading}
				keepMounted
				skeleton={<TableSkeleton rows={8} mih={320} />}
			>
				{data?.length ? (
					<TableData<IAnalyticsIncidentItem> data={data} limit={30}>
						<DataColumn<IAnalyticsIncidentItem> field='data' header='Ошибка' sortable ellipsis	noWrap style={{
							fontWeight: 'bolder'
						}} />
						<DataColumn<IAnalyticsIncidentItem> field='total_counter' header='Всего ошибок' sortable ellipsis noWrap />
						{(template.fields_name || []).map((field) => <DataColumn<IAnalyticsIncidentItem> field={field} header={ef.findLabelByCode(field)} toggleable={() => {
							handleRemove(field)
						}} sortable ellipsis noWrap />)}
						<DataColumn<IAnalyticsIncidentItem> style={{
							width: 40,
						}} field='.' header={<HoverCard>
							<HoverCard.Target>
								<ButtonIcon size='xs'
									tooltip="Сбросить"
									onClick={() =>
										updateTemplate({
											fields_name: fields,
										})
									}
								>
									<TbReload size='80%' />
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
						</HoverCard>} body={() => <></>} />
					</TableData>
				) : (
					<IncidentEmpty filterdate={filterdate} />
				)}
			</Loading>
		</Stack>
	);
};

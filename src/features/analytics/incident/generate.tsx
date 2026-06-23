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
import { notification } from "@/shared/notification/notification";
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
import { useEffect, useMemo, useState } from "react";
import { TbDownload, TbPlus, TbReload, TbXboxX } from "react-icons/tb";

interface IncidentGenerateProps {
	filterdate: [DateValue, DateValue];
	filter?: boolean;
	fields?: string[];
	initialDataFilters?: string[];
	onLoading?: (loading: boolean) => void;
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
	onLoading,
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

	useEffect(() => {
		onLoading?.(isLoading);
	}, [isLoading, onLoading]);

	const templateData = useMemo(
		() =>
			Array.isArray(template.data)
				? template.data
				: template.data
					? [template.data]
					: [],
		[template.data],
	);

	const handleRemove = (field: string) => {
		updateTemplate({
			fields_name: template.fields_name.filter((item) => item !== field),
		});
	};

	const handleAddField = (field: string) => {
		updateTemplate({
			fields_name: [...template.fields_name, field],
		});
	};

	const [value, setValue] = useState("");
	
	const handleKeyPress = ({ key }: React.KeyboardEvent) => {
		if (key === "Enter" && value) {
			updateTemplate({
				data: [...new Set([...templateData, value])],
			});
			setValue("");
		}
	};
	const handleAddData = () => {
		if (value) {
			updateTemplate({
				data: [...new Set([...templateData, value])],
			});
			setValue("");
		}
	};
	const handleRemoveItem = (value: string) => {
		updateTemplate({
			data: templateData.filter((item) => value !== item),
		});
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
			notification.alert("Нет данных для скачивания");
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
							{templateData.map((item) => (
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
						{(template.fields_name || []).map((field) => (
							<DataColumn<IAnalyticsIncidentItem>
								key={field}
								field={field}
								header={ef.findLabelByCode(field)}
								toggleable={() => {
									handleRemove(field)
								}}
								sortable
								ellipsis
								noWrap
							/>
						))}
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
						</HoverCard>} body={() => <></>} align='right' width={36} />
					</TableData>
				) : (
					<IncidentEmpty filterdate={filterdate} />
				)}
			</Loading>
		</Stack>
	);
};

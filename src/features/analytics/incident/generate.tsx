import {
	SelectAnalyticsIncidentFields,
	useEnumsFields,
	useQueryIncident
} from "@/entites/analytics";
import { $setting } from "@/shared";
import { useQueryLoading } from "@/shared/hooks";
import { ButtonIcon, ButtonRemove, Loading } from "@/shared/ui";
import { XColumn, XTable } from "@/shared/ui/table/table";
import {
	ActionIcon,
	Center,
	Group,
	HoverCard,
	Stack,
	TextInput
} from "@mantine/core";
import { type DateValue } from "@mantine/dates";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { TbPlus, TbReload, TbXboxX } from "react-icons/tb";

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
					<XTable<IAnalyticsIncidentItem> data={data}>
						<XColumn<IAnalyticsIncidentItem> field='data' header='Ошибка' sortable ellipsis	noWrap style={{
							fontWeight: 'bolder'
						}} />
						<XColumn<IAnalyticsIncidentItem> field='total_counter' header='Всего ошибок' sortable ellipsis noWrap />
						{(template.fields_name || []).map((field) => <XColumn<IAnalyticsIncidentItem> field={field} header={ef.findLabelByCode(field)} toggleable={() => {
							handleRemove(field)
						}} sortable ellipsis noWrap />)}
						<XColumn<IAnalyticsIncidentItem> style={{
							width: 40,
						}} field='_' header={<HoverCard>
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
					</XTable>
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

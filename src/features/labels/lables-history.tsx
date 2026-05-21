import { useStoreUserProfile } from "@/entites/auth";
import { selectHistoryForProduction, useStoreCountLabel } from "@/entites/labels";
import { useQueryPlace, useQueryProductions } from "@/entites/users";
import { $setting } from "@/shared";
import {
	DataColumn,
	Loading,
	TableData,
	Text
} from "@/shared/ui";
import { factorySelect, type factorySelectProps } from "@/shared/utils";
import { Card, Group, SimpleGrid, Stack } from "@mantine/core";
import "@style";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";

export const LabelsHistory = () => {
	const production_id = Number(useStoreUserProfile(state => state.production_id)) || 0
	const storeCountLabel = useStoreCountLabel();
	const qp = useQueryProductions();

	const SelectPlace = factorySelect(useQueryPlace(production_id))
	const SelectPrint = factorySelect(useMemo<factorySelectProps>(() => ({
		isLoading: storeCountLabel.isLoading,
		dataSelect: [{
			value: '',
			label: 'Все этикетки'
		}].concat(
			[...new Set(selectHistoryForProduction(production_id)(storeCountLabel).map(item => item.format_template))].map(value => ({
				value,
				label: value
			}))
		)
	}), [storeCountLabel.isLoading, storeCountLabel.history]))
	
	const [place, setPlace] = useState(0)
	const [print, setPrint] = useState('')

	const data = useMemo<ICountLabelHistoryItem[]>(() => {
		return selectHistoryForProduction(production_id)(storeCountLabel).filter(item => place === 0 || item.place_id === place).filter(item => !print || item.format_template === print)
	}, [storeCountLabel.history, production_id, place, print])
	
	useEffect(() => {
		storeCountLabel.loadHistory();
	}, []);
	
	return <Loading active={storeCountLabel.isLoading} keepMounted>
		<Stack>
			<Group justify="space-between">
				<Text px='sm' fz='h2'>
					{qp.findNameById(production_id)}
				</Text>
				<Group>
					<SelectPlace label='Линия' value={String(place)} onChange={(v) => setPlace(Number(v))} />
					<SelectPrint label='Этикетка' value={print} onChange={setPrint} />
				</Group>
			</Group>
			<TableData<ICountLabelHistoryItem> data={data} withHeader={false} breakpoint="xs" layout={({nodes, columns}) => {
					return <SimpleGrid cols={1}>
						{nodes.map((item) => <Card key={item.index} withBorder>
							{columns.filter(column => column.isField).map((column) => <Group key={column.field as string} align='flex-start' justify='space-between' grow style={{
								borderBottom: '1px dashed var(--mantine-color-default-border)',
							}}>
								<div>
									<Text truncate="end">{item.data.place_name}</Text>
									<Text opacity={0.6} fz='xs'>
										{dayjs(item.data.date_applic).format($setting.get('formatDateTime'))} -{" "}
										{item.data.format_template}
									</Text>
								</div>
								<Stack>
									<Text fw={500} >
										{item.data.consumption_m || "-"} м.
									</Text>
									<Text fw={500} >
										{item.data.count_label || "-"} шт.
									</Text>
								</Stack>
							</Group>)}
						</Card>)}
					</SimpleGrid>
				}}>
				<DataColumn<ICountLabelHistoryItem> field="place_name" body={(item) => <>
					<Text truncate="end">{item.place_name}</Text>
					<Text opacity={0.6} fz='xs'>
						{dayjs(item.date_applic).format($setting.get('formatDateTime'))} -{" "}
						{item.format_template}
					</Text>
				</>} />
				<DataColumn<ICountLabelHistoryItem> field="consumption_m" body={(item) => <>{item.consumption_m || "-"} м.</>} />
				<DataColumn<ICountLabelHistoryItem> field="count_label" body={(item) => <>{item.count_label} шт.</>} />
			</TableData>
		</Stack>
	</Loading>
};

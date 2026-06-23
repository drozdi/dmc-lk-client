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
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";

export const LabelsHistory = () => {
	const productions = useStoreUserProfile(state => state.productions)
	const storeCountLabel = useStoreCountLabel();
	const { findNameByIds } = useQueryProductions();

	const dataHistory = useMemo<ICountLabelHistoryItem[]>(() => {
		return selectHistoryForProduction(productions)(storeCountLabel)
	}, [storeCountLabel.history, productions])

	const SelectPlace = factorySelect(useQueryPlace(productions.map(Number)))
	const [place, setPlace] = useState(0)
	const placeHistory = useMemo<ICountLabelHistoryItem[]>(() => {
		return dataHistory.filter(item => place === 0 || item.place_id === place)
	}, [dataHistory, place])

	const SelectPrint = factorySelect(useMemo<factorySelectProps>(() => ({
		isLoading: storeCountLabel.isLoading,
		dataSelect: [{
			value: '',
			label: 'Все этикетки'
		}].concat(
			[...new Set(placeHistory.map(item => item.format_template))].map(value => ({
				value,
				label: value
			}))
		)
	}), [storeCountLabel.isLoading, placeHistory]))
	const [print, setPrint] = useState('')
	const data = useMemo<ICountLabelHistoryItem[]>(() => {
		return placeHistory.filter(item => !print || item.format_template === print)
	}, [placeHistory, print])
	
	useEffect(() => {
		storeCountLabel.loadHistory();
	}, []);
	
	return <Loading active={storeCountLabel.isLoading} keepMounted>
		<Stack>
			<Group justify="space-between" grow>
				<Text px='sm' fz='h4' maw='100%' flex='1'>
					{findNameByIds(productions)}
				</Text>
				<Group miw={320} justify="space-between" flex='0' grow>
					<SelectPlace label='Линия' value={String(place)} onChange={(v) => setPlace(Number(v))} />
					<SelectPrint label='Этикетка' value={print} onChange={setPrint} />
				</Group>
			</Group>
			<TableData<ICountLabelHistoryItem> 
				data={data} withHeader={false} breakpoint="xs" 
				layout={({nodes, columns}) => <SimpleGrid cols={1}>
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
				</SimpleGrid>}>
				<DataColumn<ICountLabelHistoryItem> field="place_name" body={(item) => <>
					<Text truncate="end">{item.place_name}</Text>
					<Text opacity={0.6} fz='xs'>
						{dayjs(item.date_applic).format($setting.get('formatDateTime'))} -{" "}
						{item.format_template}
					</Text>
				</>}/>
				<DataColumn<ICountLabelHistoryItem> field="consumption_m" body={(item) => <>{item.consumption_m || "-"} м.</>} />
				<DataColumn<ICountLabelHistoryItem> field="count_label" body={(item) => <>{item.count_label || "-"} шт.</>} />
			</TableData>
		</Stack>
	</Loading>
};

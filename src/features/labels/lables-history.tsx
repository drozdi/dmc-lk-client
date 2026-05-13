import { useStoreUserProfile } from "@/entites/auth";
import { selectHistoryForProduction, useStoreCountLabel } from "@/entites/labels";
import { useQueryPlace, useQueryProductions } from "@/entites/users";
import { $setting } from "@/shared";
import {
	Item,
	ItemLabel,
	ItemSection,
	List,
	Loading,
	Text
} from "@/shared/ui";
import { factorySelect, type factorySelectProps } from "@/shared/utils";
import { Group, Stack } from "@mantine/core";
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
			<List dense separator>
				{data.map((item) => (
					<Item key={item.id}>
						<ItemSection left>
							<ItemLabel>{item.place_name}</ItemLabel>
							<ItemLabel caption>
								{dayjs(item.date_applic).format($setting.get('formatDateTime'))} -{" "}
								{item.format_template}
							</ItemLabel>
						</ItemSection>
						<ItemSection side>
							{item.consumption_m || "-"} м.
						</ItemSection>
						<ItemSection side className="!w-20">
							{item.count_label} шт.
						</ItemSection>
					</Item>
				))}
			</List>
		</Stack>
	</Loading>
};

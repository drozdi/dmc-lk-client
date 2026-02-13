import {
	GroupedContainer,
	GroupedItem,
	GroupedProvider,
} from "@/entites/labels";
import { useQueryProductList } from "@/entites/users";
import { Accordion } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";

import { requestLabelsCount } from "../../apps/labels/api";
import { LabelItem } from "../../apps/labels/features/components/label-item/label-item";
import { labelsStore } from "../../apps/labels/stores";
import { useQuery, useQueryLoading } from "../../shared/hooks";
import { ItemLabel, List, Loading } from "../../shared/ui";

export const LabelsCount = () => {
	const qpl = useQueryProductList();

	const reqLabelsCount = useQuery(requestLabelsCount);

	const isLoading = useQueryLoading(labelsStore, reqLabelsCount);

	const [dangerLimits, setDangerLimits] = useState(0);
	const [warningLimits, setWarningLimits] = useState(-50);

	const [data, setData] = useState({
		distributed: [],
		not_distributed: [],
	});

	const filterProdaction = useCallback((item) => !!item?.production_id, []);

	const ddata = useMemo(() => {
		const prod = {};

		function factoryBuild(type: string) {
			return (item) => {
				if (!filterProdaction(item)) {
					return;
				}
				const production_name = productionNameById(item.production_id);
				/*if (!production_name) {
					return
				}*/
				prod[item.production_id] = prod[item.production_id] || {
					production_id: item.production_id,
					production_name,
					sum: 0,
					distributed: [],
					notDistributed: [],
				};
				prod[item.production_id].sum += item.sum;
				prod[item.production_id][type].push(item);
			};
		}

		data.distributed.forEach(factoryBuild("distributed"));
		data.not_distributed.forEach(factoryBuild("notDistributed"));

		return Object.values(prod);
	}, [data, filterProdaction, productionNameById]);

	console.log(ddata);

	async function fetch() {
		const res = await reqLabelsCount.request();
		setData(res.data);
	}
	function updateItem(res) {
		for (const [, colections] of Object.entries(data)) {
			const item = colections.find(
				(item) =>
					item.add_label_format === res.format_template &&
					item.production_id === res.production_id,
			);
			if (item) {
				item.sum += res.count_label;
			}
		}
		setData({ ...data });
	}

	useEffect(() => {
		fetch();
	}, []);

	return (
		<>
			<Loading active={isLoading} keepMounted>
				<Accordion variant="contained">
					{ddata.map((item) => (
						<Accordion.Item
							key={item.production_id}
							value={`acc-${item.production_id}`}
						>
							<Accordion.Control>
								{item.production_name}
							</Accordion.Control>
							<Accordion.Panel>
								<List dense separator>
									<GroupedProvider
										production_id={item.production_id}
									>
										{item.distributed?.length > 0 && (
											<ItemLabel header>
												Сгрупированые
											</ItemLabel>
										)}
										{item.distributed.map((item) => (
											<GroupedContainer
												key={item.add_label_format}
												column={item.add_label_format}
											>
												<LabelItem
													editable
													item={item}
													dangerLimits={dangerLimits}
													warningLimits={
														warningLimits
													}
													onUpdate={updateItem}
												/>
											</GroupedContainer>
										))}

										{item.notDistributed?.length > 0 && (
											<ItemLabel header>
												Без группы
											</ItemLabel>
										)}
										{item.notDistributed.map((item) => (
											<GroupedItem
												key={item.add_label_format}
												id={item.add_label_format}
												data={item}
											>
												<LabelItem
													editable
													item={item}
													bg=""
													dangerLimits={dangerLimits}
													warningLimits={
														warningLimits
													}
													onUpdate={updateItem}
												/>
											</GroupedItem>
										))}
									</GroupedProvider>
								</List>
							</Accordion.Panel>
						</Accordion.Item>
					))}
				</Accordion>
			</Loading>
		</>
	);
};

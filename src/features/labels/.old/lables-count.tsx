import {
	GroupedContainer,
	GroupedItem,
	GroupedProvider,
} from "@/entites/labels";
import { useQueryProductions } from "@/entites/users";
import { Accordion } from "@mantine/core";
import { useCallback, useEffect, useMemo } from "react";

import { useStoreCountLabel } from "@/entites/labels";
import { ItemLabel, List, Loading } from "@/shared/ui";
import { LabelItem } from "./components/label-item";

interface LabelsCountProps {
	dangerLimits?: number;
	warningLimits?: number;
	warningColor?: string;
	dangerColor?: string;
}

export const LabelsCount = ({
	dangerLimits = 0,
	warningLimits = -50,
	warningColor = "red",
	dangerColor = "orange",
}: LabelsCountProps) => {
	const qp = useQueryProductions();
	const storeCountLabel = useStoreCountLabel();

	const filterProdaction = useCallback(
		(item: ICountLabelItem) => !!item?.production_id,
		[],
	);

	const ddata = useMemo<
		{
			distributed: ICountLabelItem[];
			notDistributed: ICountLabelItem[];
			production_id: IProduction["production_id"];
			production_name: IProduction["production_name"];
			sum: ICountLabelItem["sum"];
		}[]
	>(() => {
		const prod: Record<
			IProduction["production_id"],
			{
				distributed: ICountLabelItem[];
				notDistributed: ICountLabelItem[];
				production_id: IProduction["production_id"];
				production_name: IProduction["production_name"];
				sum: ICountLabelItem["sum"];
			}
		> = {};

		function factoryBuild(
			type: "distributed" | "notDistributed",
		): (item: ICountLabelItem) => void {
			return (item) => {
				if (!filterProdaction(item)) {
					return;
				}
				const production_name = qp.findNameById(item.production_id);
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

		storeCountLabel.count.distributed.forEach(factoryBuild("distributed"));
		storeCountLabel.count.not_distributed.forEach(
			factoryBuild("notDistributed"),
		);

		return Object.values(prod);
	}, [storeCountLabel.count, qp.findNameById, filterProdaction]);

	useEffect(() => {
		storeCountLabel.loadCount();
	}, []);

	return (
		<>
			<Loading active={storeCountLabel.isLoading} keepMounted>
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
													warningColor={warningColor}
													dangerColor={dangerColor}
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

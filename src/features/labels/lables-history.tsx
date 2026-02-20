import { useStoreCountLabel } from "@/entites/labels";
import { useQueryProductions } from "@/entites/users";
import { Accordion } from "@mantine/core";
import dayjs from "dayjs";
import { useEffect, useMemo } from "react";
import { Item, ItemLabel, ItemSection, List, Loading } from "../../shared/ui";

export const LabelsHistory = () => {
	const qp = useQueryProductions();
	const storeCountLabel = useStoreCountLabel();

	const ddata = useMemo<
		{
			production_id: ICountLabelHistoryItem["production_id"];
			production_name: ICountLabelHistoryItem["name_production"];
			items: ICountLabelHistoryItem[];
		}[]
	>(() => {
		const res: Record<
			ICountLabelHistoryItem["production_id"],
			{
				production_id: ICountLabelHistoryItem["production_id"];
				production_name: ICountLabelHistoryItem["name_production"];
				items: ICountLabelHistoryItem[];
			}
		> = [];

		for (const his of storeCountLabel.history) {
			if (!res[his.production_id]) {
				res[his.production_id] = {
					production_id: his.production_id,
					production_name: qp.findNameById(his.production_id),
					items: storeCountLabel
						.selectHistory(his.production_id)
						.sort((a, b) =>
							a.date_applic < b.date_applic ? 1 : -1,
						),
				};
			}
		}

		return Object.values(res);
	}, [storeCountLabel.history]);

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
							value={"tab-" + String(item.production_id)}
						>
							<Accordion.Control>
								{item.production_name}
							</Accordion.Control>
							<Accordion.Panel>
								<List dense separator>
									{item.items.map((item) => (
										<Item key={item.id}>
											<ItemSection left>
												<ItemLabel>
													{item.place_name}
												</ItemLabel>
												<ItemLabel caption>
													{dayjs(
														item.date_applic,
													).format(
														"HH:mm DD-MM-YYYY",
													)}{" "}
													- {item.format_template}
												</ItemLabel>
											</ItemSection>
											<ItemSection side>
												{item.count_label}
											</ItemSection>
										</Item>
									))}
								</List>
							</Accordion.Panel>
						</Accordion.Item>
					))}
				</Accordion>
			</Loading>
		</>
	);
};

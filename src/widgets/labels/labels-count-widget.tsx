import {
	useConsumptions,
	useGrouped,
	useStoreCountLabel,
	useStoreLabels,
} from "@/entites/labels";
import { useQueryProductions } from "@/entites/users";
import { useQueryLoading } from "@/shared/hooks";
import { LabelFormat, Widget, type WidgetProps } from "@/shared/ui";
import { round } from "@/shared/utils";
import { Accordion, Box, Table } from "@mantine/core";
import { useEffect, useMemo } from "react";

interface LabelsCountWidgetProps extends WidgetProps {}

export const LabelsCountWidget = (props: LabelsCountWidgetProps) => {
	const qp = useQueryProductions();
	const storeLabels = useStoreLabels();
	const storeCountLabel = useStoreCountLabel();

	const isLoading = useQueryLoading(storeLabels, storeCountLabel);

	const formatPrints = useGrouped();
	const formatСonsumptions = useConsumptions();
	const counts = storeCountLabel.count;

	const ddata = useMemo(() => {
		const res = {};
		for (const prod in formatPrints) {
			res[prod] = res[prod] || {
				production_id: prod,
				production_name: qp.findNameById(Number(prod)),
				labels: {},
				total: 0,
				consumptions: 0,
				minus: 0,
			};
			for (const label in formatPrints[prod]) {
				if (label === ".default") {
					continue;
				}
				res[prod].labels[label] = res[prod].labels[label] || {
					labels: [label].concat(formatPrints[prod][label]),
					total: 0,
					minus: 0,
					consumptions: 0,
					container: true,
				};
			}
			for (const label of formatPrints[prod][".default"] || []) {
				res[prod].labels[label] = res[prod].labels[label] || {
					labels: [label],
					total: 0,
					minus: 0,
					consumptions: 0,
					container: false,
				};
			}
			(formatСonsumptions[prod]?.labels || []).forEach((item) => {
				res[prod].labels[item.label] = res[prod].labels[item.label] || {};
				res[prod].labels[item.label].consumptions = item.consumption_m;
			});
		}
		for (const count of counts.distributed) {
			if (!count.production_id) {
				continue;
			}
			if (res[count.production_id]?.labels?.[count.add_label_format]) {
				res[count.production_id].labels[count.add_label_format].total +=
					count.sum === NaN ? 0 : count.sum;
			}
		}
		for (const count of counts.not_distributed) {
			if (!count.production_id) {
				continue;
			}
			if (res[count.production_id]?.labels?.[count.add_label_format]) {
				res[count.production_id].labels[count.add_label_format].total +=
					count.sum === NaN ? 0 : count.sum;
			}
		}
		for (const prod in res) {
			for (const label in res[prod].labels) {
				if (
					res[prod].labels[label].minus === 0 &&
					res[prod].labels[label].total === 0 &&
					res[prod].labels[label].consumptions === 0
				) {
					delete res[prod].labels[label];
				}
			}
			if (Object.values(res[prod].labels).length === 0) {
				res[prod] = undefined;
				delete res[prod];
			}
		}

		Object.values(res).forEach((production) => {
			if (production) {
				production.total = Object.values(production.labels).reduce(
					(acc, item) => acc + (item?.total || 0),
					0,
				);
				production.minus = Object.values(production.labels).reduce(
					(acc, item) => acc + item?.minus || 0,
					0,
				);
				production.consumptions = Object.values(production.labels).reduce(
					(acc, item) => acc + item.consumptions,
					0,
				);
			}
		});
		return Object.values(res);
	}, [formatPrints, counts, formatСonsumptions, qp.findNameById]);

	useEffect(() => {
		storeLabels.load();
		storeCountLabel.load();
	}, []);

	return (
		<Widget {...props} loading={isLoading} title="Сводная история">
			<Accordion>
				{ddata.map((production) => (
					<Accordion.Item
						key={production.production_id}
						value={"acc-" + production.production_id}
					>
						<Accordion.Control px="xs">
							<Box my="-xs">{production.production_name}</Box>
						</Accordion.Control>
						<Accordion.Panel>
							<Table withTableBorder withRowBorders withColumnBorders>
								<Table.Thead>
									<Table.Tr>
										<Table.Th>Этикетка</Table.Th>
										<Table.Th>Расход ленты (м)</Table.Th>
										<Table.Th>Остаток этикеток (шт.)</Table.Th>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{Object.entries(production.labels).map(
										([label, { total, consumptions }]) => {
											return (
												<Table.Tr>
													<Table.Td>
														<LabelFormat>{label}</LabelFormat>
													</Table.Td>
													<Table.Td>{round(consumptions)}</Table.Td>
													<Table.Td>
														{total && total !== NaN ? total : 0}
													</Table.Td>
												</Table.Tr>
											);
										},
									)}
								</Table.Tbody>
							</Table>
						</Accordion.Panel>
					</Accordion.Item>
				))}
			</Accordion>
		</Widget>
	);
};

import { useQueryAnalytics } from "@/entites/analytics";
import {
	GroupedContainer,
	GroupedItem,
	GroupedProvider,
	useGrouped,
	useStoreCountLabel,
	useStoreLabels,
} from "@/entites/labels";
import { useQueryProductions } from "@/entites/users";
import { LabelFormat, Widget, type WidgetProps } from "@/shared/ui";
import { Accordion, Group, Table, Text } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { TbList } from "react-icons/tb";

interface CountWidgetProps extends WidgetProps, Partial<IRequestAnalytics> {}

export const WidgetCount = ({
	filterdate,
	step = "d",
	event = "p",
	...props
}: CountWidgetProps) => {
	return "";
	const storeCountLabel = useStoreCountLabel();
	const storeLabels = useStoreLabels();
	const qa = useQueryAnalytics({
		filterdate,
		step,
		event,
	});
	const qp = useQueryProductions();

	const labelsFormat = useGrouped();
	const [active, setActive] = useState(false);

	const res = useMemo(() => {
		const res = {};
		for (const prod in labelsFormat) {
			res[prod] = res[prod] || {
				production_id: prod,
				production_name: qp.findNameById(Number(prod)),
				labels: {},
				total: 0,
				minus: 0,
			};
			for (const label in labelsFormat[prod]) {
				if (label === ".default") {
					continue;
				}
				res[prod].labels[label] = res[prod].labels[label] || {
					labels: [label].concat(labelsFormat[prod][label]),
					total: 0,
					minus: 0,
					container: true,
				};
			}
			for (const label of labelsFormat[prod][".default"] || []) {
				res[prod].labels[label.print] = res[prod].labels[label] || {
					labels: [label],
					total: 0,
					minus: 0,
					container: false,
				};
			}
		}
		for (const count of storeCountLabel.count.distributed) {
			if (!count.production_id) {
				continue;
			}
			if (res[count.production_id]?.labels?.[count.add_label_format]) {
				res[count.production_id].labels[count.add_label_format].total +=
					count.sum;
			}
		}
		for (const count of storeCountLabel.count.not_distributed) {
			if (!count.production_id) {
				continue;
			}
			if (res[count.production_id]?.labels?.[count.add_label_format]) {
				res[count.production_id].labels[count.add_label_format].total +=
					count.sum;
			}
		}
		for (const production of qa.data.production || []) {
			for (const data of production.data || []) {
				Object.entries(res[production.production_id]?.labels || {}).forEach(
					([label, labels]) => {
						if (labels.labels.includes(data.data)) {
							labels.minus += data.count;
						}
					},
				);
			}
		}
		for (const prod in res) {
			for (const label in res[prod].labels) {
				if (
					res[prod].labels[label].minus === 0 &&
					res[prod].labels[label].total === 0
				) {
					// delete res[prod].labels[label];
				}
			}
			if (Object.values(res[prod].labels).length === 0) {
				res[prod] = undefined;
				// delete res[prod];
			}
		}
		Object.values(res).forEach((production) => {
			if (production) {
				production.total = Object.values(production.labels).reduce(
					(acc, item) => acc + item.total,
					0,
				);
				production.minus = Object.values(production.labels).reduce(
					(acc, item) => acc + item.minus,
					0,
				);
			}
		});
		return res;
	}, [labelsFormat, storeCountLabel.count, qa.data, qp.findNameById]);

	useEffect(() => {
		qa.fetch();
		storeLabels.load();
		storeCountLabel.loadCount();
	}, []);

	return (
		<Widget
			{...props}
			loading={
				qa.isLoading || storeCountLabel.isLoading || storeLabels.isLoading
			}
			title={
				<>
					Расход этикеток: расход:{" "}
					{Object.values(res).reduce((acc, item) => acc + item.minus, 0)}{" "}
					остаток:{" "}
					{Object.values(res).reduce((acc, item) => acc + item.total, 0)}
				</>
			}
		>
			<Accordion chevronPosition="left">
				{Object.values(res).map((production) => (
					<Accordion.Item
						key={production.production_id}
						value={"acc-" + production.production_id}
					>
						<Accordion.Control>
							<Group my="-xs" justify="space-between">
								<Text>
									{production.production_name} ({production.production_id})
								</Text>
								<Group justify="space-between" miw="50%">
									<Text>расход: {production.minus}</Text>
									<Text miw="50%">остаток: {production.total}</Text>
								</Group>
							</Group>
						</Accordion.Control>
						<Accordion.Panel>
							<Table withTableBorder withRowBorders withColumnBorders>
								<Table.Thead>
									<Table.Tr>
										<Table.Th w="2rem"></Table.Th>
										<Table.Th>Этикетка</Table.Th>
										<Table.Th>Расход</Table.Th>
										<Table.Th>Остаток</Table.Th>
									</Table.Tr>
								</Table.Thead>
								<GroupedProvider
									production_id={Number(production.production_id)}
								>
									<Table.Tbody>
										{Object.entries(production.labels).map(
											([label, { total, minus, container }]) => {
												const Wrap = container ? GroupedContainer : GroupedItem;
												const props = container
													? { column: label }
													: {
															id: label,
															data: label,
														};
												return (
													<Wrap
														key={production.production_id + label}
														{...props}
													>
														<Table.Tr>
															<Table.Td ta="center">
																{container === false && <TbList />}
															</Table.Td>
															<Table.Td>
																<LabelFormat>{label}</LabelFormat>
															</Table.Td>
															<Table.Td>{minus}</Table.Td>
															<Table.Td>{total}</Table.Td>
														</Table.Tr>
													</Wrap>
												);
											},
										)}
									</Table.Tbody>
								</GroupedProvider>
							</Table>
						</Accordion.Panel>
					</Accordion.Item>
				))}
			</Accordion>
		</Widget>
	);
};

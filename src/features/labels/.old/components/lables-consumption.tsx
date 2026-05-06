import {
	useGrouped,
	useStoreCountLabel,
	useStoreLabels,
} from "@/entites/labels";
import { useQueryProductions } from "@/entites/users";
import { Loading } from "@/shared/ui";
import { Accordion, Table } from "@mantine/core";
import { useEffect, useMemo } from "react";

export const LablesConsumption = () => {
	const qp = useQueryProductions();
	const storeLabels = useStoreLabels();
	const storeCountLabel = useStoreCountLabel();
	const grouped = useGrouped();

	//console.log(grouped, storeCountLabel.history)
	// const formatСonsumptions = useFormatСonsumptions()
	// const ddata = useMemo(() => {
	// 	return Object.values(formatСonsumptions)
	// }, [formatСonsumptions])

	const ddata = useMemo(() => {
		const res = { ...grouped };
		for (const his of storeCountLabel.history) {
			let format = ".default";
			for (const fp in res[his.production_id]) {
				format =
					res[his.production_id][fp]?.find(
						(e) => e.print === his.format_template,
					)?.format || ".default";
				if (format !== ".default") {
					break;
				}
			}
			if (res[his.production_id][format]) {
				const label = res[his.production_id][format]?.find(
					(e) => e.print === his.format_template,
				);
				if (label) {
					label.consumption_m = label?.consumption_m || 0;
					label.consumption_m += his.consumption_m || 0;
				}
			}
		}
		return res;
	}, [grouped, storeCountLabel.history]);

	useEffect(() => {
		storeCountLabel.loadHistory();
		storeLabels.load();
	}, []);
	return (
		<Loading active={storeCountLabel.isLoading} keepMounted>
			<Accordion>
				{Object.entries(ddata).map(([production_id, item]) => (
					<Accordion.Item
						key={production_id}
						value={`tab-${production_id}`}
					>
						<Accordion.Control>
							{qp.findNameById(Number(production_id))}
						</Accordion.Control>
						<Accordion.Panel>
							<Table>
								<Table.Tbody>
									<Table.Tr>
										<Table.Th colSpan={2}>
											Без групировки
										</Table.Th>
									</Table.Tr>
									{item[".default"].map((item) => (
										<Table.Tr key={item.print}>
											<Table.Td>{item.print}</Table.Td>
											<Table.Td>
												{item.consumption_m}
											</Table.Td>
										</Table.Tr>
									))}
									<Table.Tr>
										<Table.Th colSpan={2}>
											Cгрупировоные
										</Table.Th>
									</Table.Tr>
									{Object.entries(item).map(
										([label, item]) => {
											if (label === ".default") {
												return;
											}
											return (
												<Table.Tr key={label}>
													<Table.Td>{label}</Table.Td>
													<Table.Td>
														{(item || []).reduce(
															(acc, item) =>
																acc +
																item.consumption_m,
															0,
														)}
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
		</Loading>
	);
};

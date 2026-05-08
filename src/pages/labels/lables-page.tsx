import { useStoreLabels } from "@/entites/labels";
import { SelectProductions } from "@/entites/users";
import { LabelsGroup } from "@/features/labels/lables-group";
import { LabelsGroupAdd } from "@/features/labels/lables-group-add";
import { Template } from "@/layout";
import { $setting } from "@/shared";
import { Text } from "@/shared/ui";
import { Group, Paper } from "@mantine/core";

function grouped(
	production_id: IProduction["production_id"],
): ILabelProduction {
	const prints = useStoreLabels.getState().selectPrints(production_id);
	const formats = useStoreLabels.getState().selectFormats(production_id);
	const formatPrints = useStoreLabels
		.getState()
		.selectFormatPrints(production_id);

	const labels: Record<ILabelFormat["label"], ILabelFormat> =
		Object.fromEntries(
			(formats || []).map((item) => [
				item,
				{
					label: item,
					labels: {},
				} as ILabelFormat,
			]),
		) || {};

	labels[".default"] = {
		label: ".default",
		labels: Object.fromEntries(
			(prints || []).map((item) => [
				item,
				{
					id: item,
					_id: undefined,
					production_id: production_id,
					format: ".default",
					print: item,
					label: item,
					total_count: 0,
					minus_count: 0,
					plus_count: 0,
					total_consumption: 0,
					minus_consumption: 0,
					plus_consumption: 0,
				},
			]),
		),
	} as ILabelFormat;

	formatPrints.forEach((item) => {
		if (item.format) {
			labels[item.format] = labels[item.format] || {
				label: item.format,
				labels: {},
			};
			labels[item.format].labels[item.statistics_print_format] = {
				id: item.statistics_print_format,
				_id: item.id,
				production_id: production_id,
				format: item.format,
				print: item.statistics_print_format,
				label: item.statistics_print_format,
				total_count: 0,
				minus_count: 0,
				plus_count: 0,
				total_consumption: 0,
				minus_consumption: 0,
				plus_consumption: 0,
			};
		}
		delete labels[".default"].labels[item.statistics_print_format];
	});
	return {
		production_id,
		labels,
		total_count: 0,
		minus_count: 0,
		plus_count: 0,
		total_consumption: 0,
		minus_consumption: 0,
		plus_consumption: 0,
	};
}

// const rrr = useMemo<ILabelProduction[]>(() => {
// 		let productions: ILabel["production_id"][] = [];
// 		productions = productions.concat(Object.keys(storeLabels.formats));
// 		productions = productions.concat(Object.keys(storeLabels.prints));
// 		productions = [...new Set(productions)];

// 		return productions.map((production_id) => {
// 			const res = grouped(production_id);

// 			storeCountLabel.history.forEach((history) => {
// 				if (history.is_archive) {
// 					return;
// 				}
// 			});

// 			return res;
// 		});
// 	}, []);

export function LabelsPage() {
	const [production_id, setProduction_id] = $setting.useState('labels.group.production_id', 0)
	return (
		<Paper>
			<Template.Title>Групировка этикеток</Template.Title>
			<Group justify="space-between">
				<Group>
					<Text>
						Производство:
					</Text>
					<SelectProductions
						excludeds={["0"]}
						variant="underline"
						value={String(production_id)}
						onChange={(value) => 
							setProduction_id(Number(value))
						}
					/>
				</Group>
				<LabelsGroupAdd production_id={production_id} />
			</Group>
			<LabelsGroup mt='xs' production_id={production_id} />
		</Paper>
	);
}

import { useEnumsFields } from "@/entites/analytics";
import { DataTable } from "@/shared/ui";

interface ListShortProps {
	className?: string;
	fields?: string[];
	data?: IAnalyticsIncidentItem[];
}

export const ListShort = ({
	className,
	fields = [],
	data = [],
}: ListShortProps) => {
	const ef = useEnumsFields();
	const computedFields = ef.filter(fields);

	return (
		<DataTable<IAnalyticsIncidentItem>
			className={className}
			idAccessor={(row) => Object.values(row).join("")}
			columns={[
				...computedFields.map((field) => ({
					accessor: field,
					title: ef.findLabelByCode(field),
					sortKey: field,
					sortable: true,
					// noWrap: true,
				})),
				{
					accessor: "data",
					title: "Ошибка",
					sortKey: "data",
					sortable: true,
					// noWrap: true,
				},
				{
					accessor: "total_counter",
					title: "Всего",
					sortable: true,
					sortKey: "total_counter",
				},
			]}
			highlightOnHover={true}
			striped={true}
			verticalAlign="top"
			scrollAreaProps={{ type: "never" }}
			records={data}
			fetching={ef.isLoading}
		/>
	);
};

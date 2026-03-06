import { useEnumsFields, useStoreIncident } from "@/entites/analytics";
import { useQueryLoading } from "@/shared/hooks";
import { Loading } from "@/shared/ui";
import { useEffect, useState } from "react";
import { ListShort } from "./ui/list-short";

interface IncidentShortProps {
	filterdate: IRequestAnalyticsIncident["filterdate"];
	fields?: IRequestAnalyticsIncident["fields_name"];
}

export const IncidentShort = ({
	filterdate,
	fields = [
		"taskid",
		"name_production",
		"address_production",
		"place_name",
		"device_name",
		"node_name",
	],
}: IncidentShortProps) => {
	const storeIncident = useStoreIncident();
	const ef = useEnumsFields();

	const isLoading = useQueryLoading(storeIncident, ef);

	const [data, setData] = useState<IAnalyticsIncidentItem[]>([]);
	const [query, setQuery] = useState<IRequestAnalyticsIncident>({
		data: [],
		filterdate,
		fields_name: ef.filter(fields),
	});

	// ?????????????
	// useEffect(() => {
	// 	setQuery(
	// 		(v: IRequestAnalyticsIncident): IRequestAnalyticsIncident => ({
	// 			...v,
	// 			fields_name: ef.filter(fields),
	// 		}),
	// 	);
	// }, [fields, ef.filter]);

	useEffect(() => {
		setQuery(
			(v: IRequestAnalyticsIncident): IRequestAnalyticsIncident => ({
				...v,
				filterdate,
			}),
		);
	}, [filterdate]);

	useEffect(() => {
		storeIncident
			.send(query)
			.then(({ data }: IResponseAnalyticsIncident) =>
				setData(data as IAnalyticsIncidentItem[]),
			);
	}, [query]);

	return (
		<Loading active={isLoading} keepMounted>
			<ListShort fields={query.fields_name} data={data} />
		</Loading>
	);
};

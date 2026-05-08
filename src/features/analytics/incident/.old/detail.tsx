import { useStoreIncident } from "@/entites/analytics/stores/use-store-incident";
import { $setting } from "@/shared";
import { Loading } from "@/shared/ui";
import { Accordion, Center } from "@mantine/core";
import { type DateValue } from "@mantine/dates";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { IncidentDetail as SubIncidentDetail } from "./components/incident-detail";

let i = 0;

export const IncidentDetail = ({
	filterdate,
	...props
}: {
	filterdate: [DateValue, DateValue];
	[key: string]: any;
}) => {
	const storeIncident = useStoreIncident();
	const [openend, setOpenend] = useState<string[]>([]);

	const [query, setQuery] = useState({
		filterdate,
		data: [],
		fields_name: [],
	});

	const [data, setData] = useState<IAnalyticsIncidentItem[]>([]);

	useEffect(() => {
		setQuery((v) => ({
			...v,
			filterdate,
		}));
	}, [filterdate]);

	useEffect(() => {
		storeIncident.send(query).then(({ data }) => {
			setData(data || []);
		});
	}, [query]);

	return (
		<>
			<Loading {...props} active={storeIncident.isLoading} keepMounted>
				{data?.length ? (
					<Accordion multiple chevronPosition="left" onChange={setOpenend}>
						{data.map((item: IAnalyticsIncidentItem) => (
							<Accordion.Item
								key={item.data || `acc-${i++}`}
								value={item.data || `acc-${i}`}
							>
								<Accordion.Control icon={item?.total_counter}>
									{item.data}
								</Accordion.Control>
								<Accordion.Panel>
									<div style={{ minHeight: 100 }}>
										{openend.includes(item.data) && (
											<SubIncidentDetail {...query} />
										)}
									</div>
								</Accordion.Panel>
							</Accordion.Item>
						))}
					</Accordion>
				) : (
					<Center w="100%" h="10rem" fz="h1" c="dimmed">
						Данные отсутствуют за период{" "}
						{dayjs(filterdate[0]).format($setting.get("formatDate"))} -{" "}
						{dayjs(filterdate[1]).format($setting.get("formatDate"))}
					</Center>
				)}
			</Loading>
		</>
	);
};

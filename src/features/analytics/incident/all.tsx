import { useStoreIncident } from "@/entites/analytics/stores/use-store-incident";
import { Loading } from "@/shared/ui";
import { Accordion, Center } from "@mantine/core";
import { useEffect, useState } from "react";
import { IncidentDetail } from "./components/incident-detail";

let i = 0;

export const IncidentAll = ({
	query = {},
	...props
}: {
	query: IRequestAnalyticsIncident;
	[key: string]: any;
}) => {
	const [data, setData] = useState<IAnalyticsIncidentItem[]>([]);
	const storeIncident = useStoreIncident();

	const [openend, setOpenend] = useState<string[]>([]);

	useEffect(() => {
		storeIncident.send(query).then((data) => {
			setData(data || []);
		});
	}, [query]);

	return (
		<>
			<Loading {...props} active={storeIncident.isLoading} keepMounted>
				{data?.length ? (
					<Accordion
						multiple
						chevronPosition="left"
						onChange={setOpenend}
					>
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
											<IncidentDetail
												{...query}
												data={[item.data]}
											/>
										)}
									</div>
								</Accordion.Panel>
							</Accordion.Item>
						))}
					</Accordion>
				) : (
					<Center w="100%" h="10rem" fz="h1">
						Данные отсутствуют
					</Center>
				)}
			</Loading>
		</>
	);
};

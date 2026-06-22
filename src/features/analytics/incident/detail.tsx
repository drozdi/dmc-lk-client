import { useQueryIncident } from "@/entites/analytics";
import { $setting } from "@/shared";
import { Loading } from "@/shared/ui";
import { Accordion, Center } from "@mantine/core";
import { type DateValue } from "@mantine/dates";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { IncidentDetailItem } from "./detail-item";

export const IncidentDetail = ({
	filterdate,
	...props
}: {
	filterdate: [DateValue, DateValue];
	[key: string]: any;
}) => {
	const [query, setQuery] = useState({
		filterdate,
		data: [],
		fields_name: [],
	});
	const { isLoading, data, fetch } = useQueryIncident(query)
	const [openend, setOpenend] = useState<string[]>([]);

	useEffect(() => {
		setQuery((v) => ({...v, filterdate}));
	}, [filterdate])

	useEffect(() => {
		fetch(query)
	}, [query])

	return (
		<>
			<Loading {...props} active={isLoading} keepMounted>
				{data?.length ? (
					<Accordion multiple chevronPosition="left" onChange={setOpenend}>
						{data.map((item: IAnalyticsIncidentItem) => (
							<Accordion.Item
								key={item.id}
								value={item.id}
							>
								<Accordion.Control icon={item?.total_counter}>
									{item.data}
								</Accordion.Control>
								<Accordion.Panel>
									<div style={{ minHeight: 100 }}>
										{openend.includes(item.id) && (
											<IncidentDetailItem {...query} data={item.data} />
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

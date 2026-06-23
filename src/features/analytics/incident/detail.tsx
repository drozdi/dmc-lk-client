import { useQueryIncident } from "@/entites/analytics";
import { exportIncidentSummary } from "@/features/analytics/incident/utils/export-excel";
import { buildIncidentReportUrl } from "@/features/analytics/incident/utils/incident-navigation";
import { IncidentEmpty } from "@/features/analytics/incident/ui/incident-empty";
import { notification } from "@/shared/notification/notification";
import { Loading } from "@/shared/ui";
import { ListSkeleton } from "@/shared/ui/skeleton";
import { Accordion, Button, Group } from "@mantine/core";
import { type DateValue } from "@mantine/dates";
import { useEffect, useState } from "react";
import { TbDownload } from "react-icons/tb";
import { Link } from "react-router-dom";
import { getIncidentItemKey } from "./utils/incident-item";
import { IncidentDetailItem } from "./detail-item";

export const IncidentDetail = ({
	filterdate,
	onLoading,
	...props
}: {
	filterdate: [DateValue, DateValue];
	onLoading?: (loading: boolean) => void;
	[key: string]: unknown;
}) => {
	const [query, setQuery] = useState({
		filterdate,
		data: [] as string[],
		fields_name: [] as string[],
	});
	const { isLoading, data } = useQueryIncident(query);
	const [openend, setOpenend] = useState<string[]>([]);

	useEffect(() => {
		setQuery((v) => ({ ...v, filterdate }));
	}, [filterdate]);

	useEffect(() => {
		onLoading?.(isLoading);
	}, [isLoading, onLoading]);

	const handleExport = () => {
		if (!data?.length) {
			notification.alert("Нет данных для скачивания");
			return;
		}

		exportIncidentSummary(data);
	};

	return (
		<>
			<Group justify="flex-end" mb="xs">
				<Button
					variant="light"
					leftSection={<TbDownload size={16} />}
					onClick={handleExport}
					disabled={!data?.length}
					loading={isLoading}
				>
					Скачать Excel
				</Button>
			</Group>
			<Loading
				{...props}
				active={isLoading}
				keepMounted
				skeleton={<ListSkeleton items={6} mih={240} />}
			>
				{data?.length ? (
					<Accordion multiple chevronPosition="left" onChange={setOpenend}>
						{data.map((item: IAnalyticsIncidentItem, index) => {
							const itemKey = getIncidentItemKey(item, index);

							return (
								<Accordion.Item key={itemKey} value={itemKey}>
									<Accordion.Control icon={item?.total_counter}>
										<Group justify="space-between" wrap="nowrap" pr="xs">
											<span>{item.data}</span>
											<Button
												component={Link}
												to={buildIncidentReportUrl({
													filterdate,
													data: item.data,
													tab: "generate",
												})}
												variant="subtle"
												size="compact-xs"
												onClick={(event) => event.stopPropagation()}
											>
												Детально
											</Button>
										</Group>
									</Accordion.Control>
									<Accordion.Panel>
										<div style={{ minHeight: 100 }}>
											{openend.includes(itemKey) && (
												<IncidentDetailItem {...query} data={item.data} />
											)}
										</div>
									</Accordion.Panel>
								</Accordion.Item>
							);
						})}
					</Accordion>
				) : (
					<IncidentEmpty filterdate={filterdate} />
				)}
			</Loading>
		</>
	);
};

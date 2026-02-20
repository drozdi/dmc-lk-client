import { useStoreElastic } from "@/entites/analytics/stores/use-store-elastic";
import { AnalyticsElasticTable } from "@/features/analytics/elastic/table";
import { Loading } from "@/shared/ui";
import { Paper } from "@mantine/core";
import { Template } from "@t";
import { useEffect, useState } from "react";

export const AnalyticsElasticFormPage = () => {
	const storeElastic = useStoreElastic();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		storeElastic.clear();
		setIsLoading(false);
	}, []);

	return (
		<Paper>
			<Template.Title>Новый шаблон</Template.Title>
			<Loading active={isLoading} keepMounted>
				<AnalyticsElasticTable />
			</Loading>
		</Paper>
	);
};

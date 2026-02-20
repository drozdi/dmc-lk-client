import {
	useQueryQueryList,
	useQueryQueryRead,
	useStoreElastic,
} from "@/entites/analytics";
import { AnalyticsElasticTable } from "@/features/analytics/elastic/table";
import { Loading } from "@/shared/ui";
import { Paper, Select } from "@mantine/core";
import { Template } from "@t";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const AnalyticsQueryItemPage = () => {
	const qql = useQueryQueryList({
		size: 1000,
	});
	const storeElastic = useStoreElastic();
	const [name, setName] = useState("");
	const navigate = useNavigate();

	const { id_query } = useParams();

	const qqr = useQueryQueryRead(Number(id_query));

	useEffect(() => {
		if (!qqr.data) {
			return;
		}
		const { id, name_query, ...template } = qqr.data;
		setName(name_query);
		storeElastic.save(template);
		storeElastic.setNameQuery(name_query);
		storeElastic.setId(id);
	}, [qqr.data]);

	const goTo = (id: string) => {
		navigate(`/analytics/${id}`);
	};

	return (
		<Paper>
			<Select
				value={String(id_query)}
				onChange={(value) => goTo(value as string)}
				data={(qql.data || []).map(
					({
						id,
						name_query,
					}: {
						id: number | string;
						name_query: string;
					}) => ({
						value: String(id),
						label: name_query,
					}),
				)}
			/>
			<Template.Title>Запрос "{name}"</Template.Title>
			<Loading active={qqr.isLoading} keepMounted mt="xs">
				<AnalyticsElasticTable />
			</Loading>
		</Paper>
	);
};

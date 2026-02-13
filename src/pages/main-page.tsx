import { SimpleGrid } from "@mantine/core";
import dayjs from "dayjs";
import { useState } from "react";

const dNow = dayjs("2025-05-02");

export const MainPage = () => {
	const [query] = useState<Omit<IRequestAnalytics, "event">>({
		filterdate_from: dNow.day(dNow.day() - 7).format("YYYY-MM-DD"),
		filterdate_to: dNow.format("YYYY-MM-DD"),
		step: "d",
	});

	return <SimpleGrid cols={2}></SimpleGrid>;
};

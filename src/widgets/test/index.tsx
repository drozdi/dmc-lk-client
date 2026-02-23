import { Widget } from "@/shared/ui";
import { Center, Text } from "@mantine/core";
import { useEffect, useState } from "react";

export const TesstWidget = ({ timeout = 10 }) => {
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, timeout * 1000);
	}, []);
	return (
		<Widget loading={isLoading} title="Title">
			<Center h="100%">
				<Text>Проба</Text>
			</Center>
		</Widget>
	);
};

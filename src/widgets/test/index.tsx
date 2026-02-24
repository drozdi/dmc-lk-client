import { Widget } from "@/shared/ui";
import { Center, Text } from "@mantine/core";
import { useEffect, useState } from "react";

export const TesstWidget = ({
	timeout = 10,
	title = "Title",
	description = "Описание виджета",
	...props
}) => {
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, timeout * 1000);
	}, []);
	return (
		<Widget {...props} loading={isLoading} title={title}>
			<Center h="100%">
				<Text>{description}</Text>
			</Center>
		</Widget>
	);
};

import { Box, Image } from "@mantine/core";
import { Link } from "react-router-dom";

export function Logo({ className }: { className?: string }) {
	return (
		<Box component={Link} to="/" maw="100%" className={className}>
			<Image w="100%" src="/assets/Logo_DMC_512.png" />
		</Box>
	);
}

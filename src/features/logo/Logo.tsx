import { Box, Image } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";

export function Logo({ className }: { className?: string }) {
	const navigate = useNavigate();
	return (
		<Box component={Link} to="/" maw="100%" className={className}>
			<Image w="100%" src="//assets/Logo_DMC_512.png" />
		</Box>
	);
}

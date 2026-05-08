import { Box, Image } from "@mantine/core";
import { useResizeObserver } from "@mantine/hooks";
import { Link } from "react-router-dom";

export function Logo({ className }: { className?: string }) {
	const [ref, rect] = useResizeObserver();

	return (
		<Box
			component={Link}
			to="/"
			maw="100%"
			className={className}
			pos="relative"
			display="block"
			ref={ref}
		>
			<Image
				w="100%"
				src={(import.meta.env.DEV ? "" : "/lk") + "/assets/Logo_DMC_512.png"}
			/>
			<div
				style={{
					color: "rgba(192,192,192,0.7)",
					position: "absolute",
					top: "25%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					fontSize: rect.height,
					maxWidth: "100%",
				}}
			>
				beta
			</div>
		</Box>
	);
}

import { $setting } from "@/shared";
import { Box, Image } from "@mantine/core";
import { Link } from "react-router-dom";

export function Logo({ className }: { className?: string }) {
	return (
		<Box
			component={Link}
			to="/"
			maw="100%"
			className={className}
			pos="relative"
			display="block"
		>
			<Image
				w="100%"
				src={
					($setting.get("base.url") === "/" ? "" : $setting.get("base.url")) +
					"/assets/Logo_DMC_512.png"
				}
			/>
			<div
				style={{
					color: "rgba(192,192,192,0.7)",
					position: "absolute",
					top: "25%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					fontSize: 100,
				}}
			>
				beta
			</div>
		</Box>
	);
}

import { Box, LoadingOverlay, type BoxProps } from "@mantine/core";

export interface LoadingProps extends BoxProps {
	children: React.ReactNode;
	active?: boolean;
	keepMounted?: boolean;
}

export function Loading({
	children,
	active,
	keepMounted,
	...props
}: LoadingProps) {
	return (
		<Box
			pos="relative"
			miw={active ? 300 : undefined}
			mih={active ? 300 : undefined}
			{...props}
		>
			<LoadingOverlay
				visible={active}
				zIndex={1000}
				overlayProps={{ radius: "sm", blur: 2 }}
				loaderProps={{ color: "pink", type: "bars" }}
			/>
			{(keepMounted || !active) && children}
		</Box>
	);
}

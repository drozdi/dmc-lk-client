import { Box, LoadingOverlay, type BoxProps } from "@mantine/core";

export type LoadingProps<T extends BoxProps> = T & {
	children: React.ReactNode;
	active?: boolean;
	keepMounted?: boolean;
	component?: React.FC<T>;
}

export function Loading<T extends BoxProps>({
	children,
	active,
	keepMounted,
	component: Component = Box,
	...props
}: LoadingProps<T>) {
	return (
		<Component
			pos="relative"
			miw={active ? 300 : undefined}
			mih={active ? 300 : undefined}
			w={active ? 300 : undefined}
			h={active ? 300 : undefined}
			{...props}
		>
			<LoadingOverlay
				visible={active}
				zIndex={1000}
				overlayProps={{ radius: "sm", blur: 2 }}
				loaderProps={{ color: "pink", type: "bars" }}
			/>
			{(keepMounted || !active) && children}
		</Component>
	);
}

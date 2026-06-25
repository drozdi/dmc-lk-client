import { Box, LoadingOverlay, type BoxProps } from "@mantine/core";

export type LoadingProps<T extends BoxProps> = T & {
	children: React.ReactNode;
	active?: boolean;
	keepMounted?: boolean;
	component?: React.FC<T>;
	skeleton?: React.ReactNode;
}

export function Loading<T extends BoxProps>({
	children,
	active,
	keepMounted,
	component: Component = Box,
	skeleton,
	...props
}: LoadingProps<T>) {
	if (active && skeleton) {
		return (
			<Component pos="relative" {...props}>
				{skeleton}
			</Component>
		);
	}
	return (
		<Component
			pos="relative"
			miw={active ? 300 : undefined}
			mih={active ? 300 : undefined}
			{...props}
		>
			{(keepMounted || !active) && children}
			<LoadingOverlay
				visible={active}
				overlayProps={{ radius: "sm", blur: 2 }}
				loaderProps={{ color: "pink", type: "bars" }}
			/>
		</Component>
	);
}
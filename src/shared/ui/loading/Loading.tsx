import { Box, type BoxProps } from "@mantine/core";

export type LoadingProps<T extends BoxProps> = T & {
	children: React.ReactNode;
	active?: boolean;
	keepMounted?: boolean;
	component?: React.FC<T>;
	skeleton?: React.ReactNode;
};

export function Loading<T extends BoxProps>({
	children,
	active,
	keepMounted,
	skeleton,
	component: Component = Box,
	...props
}: LoadingProps<T>) {
	if (active && skeleton) {
		return (
			<Component pos="relative" {...props}>
				{skeleton}
			</Component>
		);
	}

	if (active && !keepMounted) {
		return (
			<Component
				pos="relative"
				miw={300}
				mih={120}
				{...props}
			/>
		);
	}

	return (
		<Component pos="relative" {...props}>
			{children}
		</Component>
	);
}

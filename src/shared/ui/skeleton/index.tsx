import { Center, Skeleton, Stack, type StackProps } from "@mantine/core";
import { memo } from "react";

function ChartSkeletonRoot({
	height = 180,
	...props
}: StackProps & { height?: number | string }) {
	return (
		<Stack gap="sm" p="xs" {...props}>
			<Skeleton height={height} radius="md" />
			<Stack gap={6}>
				<Skeleton height={10} width="35%" />
				<Skeleton height={10} width="25%" />
				<Skeleton height={10} width="30%" />
			</Stack>
		</Stack>
	);
}

function TableSkeletonRoot({
	rows = 6,
	...props
}: StackProps & { rows?: number }) {
	return (
		<Stack gap="xs" p="xs" {...props}>
			<Skeleton height={36} radius="sm" />
			{Array.from({ length: rows }, (_, index) => (
				<Skeleton key={index} height={32} radius="sm" />
			))}
		</Stack>
	);
}

function ListSkeletonRoot({
	items = 5,
	...props
}: StackProps & { items?: number }) {
	return (
		<Stack gap="sm" p="xs" {...props}>
			{Array.from({ length: items }, (_, index) => (
				<Skeleton key={index} height={44} radius="sm" />
			))}
		</Stack>
	);
}

function StatSkeletonRoot(props: StackProps) {
	return (
		<Center h="100%" mih={120} {...props}>
			<Stack align="center" gap="sm" w="100%" p="md">
				<Skeleton height={52} width="45%" radius="md" />
				<Skeleton height={14} width="35%" />
				<Skeleton height={14} width="55%" />
			</Stack>
		</Center>
	);
}

export const ChartSkeleton = memo(ChartSkeletonRoot);
export const TableSkeleton = memo(TableSkeletonRoot);
export const ListSkeleton = memo(ListSkeletonRoot);
export const StatSkeleton = memo(StatSkeletonRoot);

import { ActionIcon, Box, Button, Group, Select, type BoxProps } from "@mantine/core";
import { usePagination } from "@mantine/hooks";
import React, { useCallback } from "react";
import { TbChevronsLeft, TbChevronsRight } from "react-icons/tb";

export interface TablePaginationProps<T = object> extends BoxProps {
	page: string | number;
	total: number;
	limit?: number;
	limits?: number[];
	nextLabel?: React.ReactNode;
	previousLabel?: React.ReactNode;
	loading?: boolean;
	activePprevious?: boolean;
	activeNext?: boolean;
	onNext?: () => void;
	onPprevious?: () => void;
	onChangeLimit?: (limit: number) => void;
	onChangePage?: (page: number) => void;
}

export function TablePagination<T = object>({ 
	page, limit, limits = [15, 30, 50, 75, 100], total,
	loading, activePprevious, activeNext,
	onNext, onPprevious, onChangeLimit, onChangePage,
	nextLabel= 'Следующая', previousLabel= 'Предыдущая', ...props 
}: TablePaginationProps<T>) {
	const showedSibling = onNext && onPprevious
	const showed = !(showedSibling) && total > 1

	const pagination = usePagination({
		total: total,
		siblings: 1,
		boundaries: 1,
		onChange: onChangePage,
	})
	
	const handlePprevious = useCallback(() => {
		(onPprevious || pagination.previous)()
	}, [onPprevious, pagination.previous])

	const handleNext = useCallback(() => {
		(onNext || pagination.next)()
	}, [onNext, pagination.next])

	const disabledPrevious = (showed && pagination.active === 1) || (!showed && !activePprevious)
	const disabledNext = (showed && pagination.active === total) || (!showed && !activeNext)

	return <Box w='100%' {...props}>
		<Group justify="space-between" align="start">
			<Group flex='1'>
				{showed && <ActionIcon loading={loading} variant="default" onClick={pagination.first} disabled={pagination.active === 1}>
					<TbChevronsLeft />
				</ActionIcon>}
				{(showed || showedSibling) && <Button size="compact-md" loading={loading} variant="default" onClick={handlePprevious} disabled={disabledPrevious}>
					{previousLabel}
				</Button>}
				{showed && pagination.range.map((page, index) =>
					page === 'dots' ? (
						<span key={index}>...</span>
					) : (
						<ActionIcon 
							loading={loading}
							key={index}
							onClick={() => pagination.setPage(page)}
							variant={pagination.active === page ? 'filled' : 'default'}
						>
							{page}
						</ActionIcon>
					)
				)}
				{(showed || showedSibling) && <Button size="compact-md" loading={loading} variant="default" onClick={handleNext} disabled={disabledNext}>
					{nextLabel}
				</Button>}
				{showed && <ActionIcon loading={loading} variant="default" onClick={pagination.last} disabled={pagination.active === total}>
					<TbChevronsRight />
				</ActionIcon>}
			</Group>
			<Box flex='0'>
				<Select size="xs" w='4rem' loading={loading} defaultValue={limit} allowDeselect={false} data={limits} onChange={onChangeLimit} />
			</Box>
		</Group>
	</Box>
}
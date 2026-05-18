import { Box, Button, Group, Select } from "@mantine/core";
import { usePagination } from "@mantine/hooks";
import { useCallback } from "react";
import { TbChevronsLeft, TbChevronsRight } from "react-icons/tb";

export interface TablePaginationProps<T = object> {
	total: number;
	limit?: number;
	limits?: number[];
	nextLabel?: string;
	previousLabel?: string;
	onNext?: () => void;
	onPprevious?: () => void;
	onChangeLimit?: (limit: number) => void;
	onChangePage?: (page: number) => void;
}

export function TablePagination<T = object>({ 
	limit, limits = [15, 30, 50, 75, 100], total,
	onNext, onPprevious, onChangeLimit, onChangePage,
	nextLabel= 'Следующая', previousLabel= 'Предыдущая', ...props 
}: TablePaginationProps<T>) {
	const showed = !(onNext && onPprevious)

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

	return <Box mt='md' {...props}>
		<Group justify="space-between" align="start">
			<Group flex='1'>
				{showed && <Button variant="default" onClick={pagination.first} disabled={pagination.active === 1}>
          <TbChevronsLeft />
        </Button>}
        <Button variant="default" onClick={handlePprevious} disabled={pagination.active === 1}>
          {previousLabel}
        </Button>
				{showed && pagination.range.map((page, index) =>
          page === 'dots' ? (
            <span key={index}>...</span>
          ) : (
            <Button
              key={index}
              onClick={() => pagination.setPage(page)}
              variant={pagination.active === page ? 'filled' : 'default'}
            >
              {page}
            </Button>
          )
        )}
				<Button variant="default" onClick={handleNext} disabled={pagination.active === total}>
          {nextLabel}
        </Button>
        {showed && <Button variant="default" onClick={pagination.last} disabled={pagination.active === total}>
          <TbChevronsRight />
        </Button>}
			</Group>
			<Box flex='0'>
				<Select defaultValue={limit} allowDeselect={false} data={limits} onChange={onChangeLimit} />
			</Box>
		</Group>
	</Box>
}
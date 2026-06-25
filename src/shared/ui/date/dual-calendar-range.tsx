import { Divider, Group, Popover, Stack, Text, TextInput } from "@mantine/core";
import { Calendar, type DateValue } from "@mantine/dates";
import dayjs from "dayjs";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

const formatDate = (date: DateValue): string => {
	return date ? dayjs(date).format("LL") : "";
};

const getDayStyle = (
	date: DateValue,
	startDate: DateValue,
	endDate: DateValue,
) => {
	if (!startDate) return {};
	const isStart = dayjs(date).isSame(startDate, "day");
	const isEnd = endDate ? dayjs(date).isSame(endDate, "day") : false;
	const inRange =
		startDate &&
		endDate &&
		dayjs(date).isAfter(startDate, "day") &&
		dayjs(date).isBefore(endDate, "day");

	if (isStart || isEnd) {
		return {
			backgroundColor: "var(--mantine-primary-color-filled-hover)",
			color: "white",
			borderRadius: "50%",
		};
	}
	if (inRange) {
		return {
			backgroundColor: "var(--mantine-primary-color-light)",
		};
	}
	return {};
};

const isSameDay = (a: DateValue, b: DateValue): boolean => {
	if (!a || !b) {
		return false;
	}
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
};

const isAfterDay = (a: DateValue, b: DateValue): boolean => {
	if (!a || !b) {
		return false;
	}
	return a > b && !isSameDay(a, b);
};

const isBeforeDay = (a: DateValue, b: DateValue): boolean => {
	if (!a || !b) {
		return false;
	}
	return a < b && !isSameDay(a, b);
};

export interface DualCalendarRangeProps {
	defaultValue?: [DateValue, DateValue];
	value?: [DateValue, DateValue];
	onChange?: (value: [DateValue, DateValue]) => void;
	error?: React.ReactNode;
	[key: string]: any;
}

function DualCalendarRangeRoot({
	defaultValue = [null, null],
	value = [null, null],
	onChange,
	error,
	...props
}: DualCalendarRangeProps) {
	const isControlled = value !== undefined;

	const [internalStart, setInternalStart] = useState(defaultValue[0]);
	const [internalEnd, setInternalEnd] = useState(defaultValue[1]);

	// Синхронизация внешнего value
	useEffect(() => {
		if (isControlled) {
			setInternalStart(value[0] ?? null);
			setInternalEnd(value[1] ?? null);
		}
	}, [value, isControlled]);

	const startDate = isControlled ? value[0] : internalStart;
	const endDate = isControlled ? value[1] : internalEnd;

	const updateRange = useCallback(
		(newStart: DateValue, newEnd: DateValue) => {
			if (!isControlled) {
				setInternalStart(newStart);
				setInternalEnd(newEnd);
			}
			onChange?.([newStart, newEnd]);
		},
		[isControlled, onChange],
	);

	const handleLeftCalendarClick = useCallback(
		(date: DateValue) => {
			if (!date) {
				return;
			}
			if (date === startDate || date === endDate) {
				return;
			}
			if (endDate && date > endDate) {
				updateRange(endDate, date);
			} else {
				updateRange(date, endDate);
			}
		},
		[startDate, endDate, updateRange],
	);

	const handleRightCalendarClick = useCallback(
		(date: DateValue) => {
			if (!date) {
				return;
			}
			if (date === startDate || date === endDate) {
				return;
			}
			if (startDate && date < startDate) {
				updateRange(date, startDate);
			} else {
				updateRange(startDate, date);
			}
		},
		[startDate, endDate, updateRange],
	);

	const startDateLabel = useMemo(() => formatDate(startDate), [startDate]);
	const endDateLabel = useMemo(() => formatDate(endDate), [endDate]);

	const leftDayProps = useCallback(
		(date: DateValue) => ({
			onClick: () => handleLeftCalendarClick(date),
			style: getDayStyle(date, startDate, endDate),
		}),
		[handleLeftCalendarClick, startDate, endDate],
	);

	const rightDayProps = useCallback(
		(date: DateValue) => ({
			onClick: () => handleRightCalendarClick(date),
			style: getDayStyle(date, startDate, endDate),
		}),
		[handleRightCalendarClick, startDate, endDate],
	);

	return (
		<Popover>
			<Popover.Target>
				<Stack>
					<Group justify="center" gap="0" {...props}>
						<TextInput
							label="От"
							value={startDateLabel}
							variant="сontained"
							readOnly
							radius="0"
						/>
						<TextInput
							label="До"
							value={endDateLabel}
							variant="сontained"
							radius="0"
							readOnly
						/>
					</Group>
					{error && <Text size="xs" c="red">{error}</Text>}
				</Stack>
			</Popover.Target>
			<Popover.Dropdown>
				<Group>
					<Calendar
						defaultDate={startDate || undefined}
						getDayProps={leftDayProps}
					/>
					<Divider orientation="vertical" mx="xs" />
					<Calendar
						defaultDate={endDate || undefined}
						getDayProps={rightDayProps}
					/>
				</Group>
			</Popover.Dropdown>
		</Popover>
	);
}

export const DualCalendarRange = memo(DualCalendarRangeRoot);

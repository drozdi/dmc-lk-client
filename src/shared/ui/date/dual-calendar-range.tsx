import { Divider, Group, Popover, TextInput } from "@mantine/core";
import { Calendar, type DateValue } from "@mantine/dates";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface DualCalendarRangeProps {
	defaultValue?: [DateValue, DateValue];
	value?: [DateValue, DateValue];
	onChange?: (value: [DateValue, DateValue]) => void;
}

export function DualCalendarRange({
	defaultValue = [null, null],
	value = [null, null],
	onChange,
}: DualCalendarRangeProps) {
	const [startDate, setStartDate] = useState<DateValue>(
		value?.[0] || defaultValue?.[0] || null,
	);
	const [endDate, setEndDate] = useState<DateValue>(
		value?.[1] || defaultValue?.[1] || null,
	);

	useEffect(() => {
		value?.[0] && setStartDate(value[0]);
		value?.[1] && setEndDate(value[1]);
	}, [value]);

	useEffect(() => {
		onChange?.([startDate, endDate]);
	}, [startDate, endDate]);

	const handleDateClick = (date: DateValue) => {
		if (!startDate) {
			if (!endDate) {
				setStartDate(date);
			} else if (date < endDate) {
				setStartDate(date);
			} else if (date > endDate) {
				setStartDate(endDate);
				setEndDate(date);
			}
		} else {
			if (date < startDate) {
				setStartDate(date);
				setEndDate(startDate);
			} else if (date > startDate) {
				setEndDate(date);
			}
		}
		// if (!startDate || (startDate && endDate)) {
		// 	// Ничего не выбрано или диапазон уже заполнен – начинаем новый диапазон
		// 	setStartDate(date);
		// 	setEndDate(null);
		// } else if (startDate && !endDate) {
		// 	// Выбрано начало, выбираем конец
		// 	if (date < startDate) {
		// 		// Если кликнули дату раньше начала, делаем её новым началом
		// 		setStartDate(date);
		// 	} else {
		// 		setEndDate(date);
		// 	}
		// }
	};

	// Подсветка для любого календаря
	const getDayStyle = (date: DateValue) => {
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
				backgroundColor: "var(--mantine-color-blue-6)",
				color: "white",
				borderRadius: "50%",
			};
		}
		if (inRange) {
			return {
				backgroundColor: "var(--mantine-color-blue-2)",
				borderRadius: 0,
			};
		}
		return {};
	};

	const formatDate = (date: DateValue) => {
		return date ? dayjs(date).format("LL") : "";
	};

	return (
		<Popover opened={true}>
			<Popover.Target>
				<Group justify="center" gap="0">
					<TextInput value={formatDate(startDate)} readOnly style={{}} />
					<TextInput
						value={formatDate(endDate)}
						readOnly
						style={{
							borderLeft: "0 none",
							marginLeft: -1,
						}}
					/>
				</Group>
			</Popover.Target>
			<Popover.Dropdown>
				<Group>
					<Calendar
						getDayProps={(date) => ({
							onClick: () => handleDateClick(date),
							style: getDayStyle(date),
						})}
					/>
					<Divider orientation="vertical" mx="xs" />
					<Calendar
						getDayProps={(date) => ({
							onClick: () => handleDateClick(date),
							style: getDayStyle(date),
						})}
						month={
							startDate
								? dayjs(startDate).add(1, "month").toDate()
								: dayjs().add(1, "month").toDate()
						}
					/>
				</Group>
			</Popover.Dropdown>
		</Popover>
	);
}

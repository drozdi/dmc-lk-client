import { useEnumsEvents } from "@/entites/analytics";
import { randomColorLabel } from "@/entites/labels";
import { $setting } from "@/shared";
import { TooltipContentBar } from "@/shared/ui";
import dayjs from "dayjs";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
	type BarShapeProps,
} from "recharts";
import type { EventsProps } from "./type";

export interface EventsStackProps extends EventsProps {}

const ee = useEnumsEvents();

const CustomBar = (props) => {
	const {
		x,
		y,
		width,
		height, // стандартные размеры
		fill,
		value,
		index,
		payload,
	} = props;

	const isEmpty = value === null || value === undefined;

	// Вычисляем настоящую высоту столбца
	// Если данные есть — используем высоту от Recharts (уже пропорциональна значению)
	// Если данных нет — рисуем столбец от оси X (y + height) до верхней границы (y)
	// Примечание: при нулевом значении height=0, y указывает на верхнюю границу столбца.
	// Ось X находится на уровне y + height (для положительных значений).
	const effectiveHeight = isEmpty
		? props.yAxisHeight || 0 // нужна высота всей оси Y
		: Math.max(0, height);

	// Координата Y: для пустого столбца - от оси (y+height) вверх на effectiveHeight
	const effectiveY = isEmpty
		? y + height // точка на оси X
		: y;

	// Цвет: для пустых зададим, например, светло-серый с прозрачностью
	const barColor = isEmpty ? "#dddddd" : fill;

	return (
		<rect
			x={x}
			y={effectiveY}
			width={width}
			height={isEmpty ? effectiveHeight : height}
			fill={barColor}
			stroke="none"
			rx={4}
		/>
	);
};

const CustomNestedBar = (props: BarShapeProps) => {
	const { x, y, width, height, payload, fill } = props;
	console.log(props);
	const { total, v } = payload;
	let totalHeight = (height / v) * total;

	if (Number.isNaN(totalHeight)) {
		totalHeight = height;
	}

	return (
		<g>
			<rect
				x={x}
				y={0}
				width={width}
				height={totalHeight}
				fill={randomColorLabel("def")}
			/>
			<rect x={x} y={y} width={width} height={height} fill={fill} />
		</g>
	);
};

const CustomBarWithEmptyZone = (props) => {
	const { x, y, width, fill, value, payload, allData } = props;
	const isEmpty = value === null || value === undefined;

	// Опционально: получаем максимальное значение для всего графика
	// Для этого нужно передать maxAmount через контекст или просто вычислить заранее
	// Допустим, мы знаем, что максимальная сумма = 10000, а высота графика = 250px
	const fullHeight = 250; // осторожно: в реальном проекте нужно пересчитать пропорции
	const barY = y + (isEmpty ? props.height : 0); // для пустого рисуем от текущей Y вверх

	return (
		<rect
			x={x}
			y={isEmpty ? y : y} // если хотите пустой от основания, а не сверху
			width={width}
			height={isEmpty ? fullHeight : props.height}
			fill={isEmpty ? "#ffcccc" : fill}
			rx={4}
		/>
	);
};

export const EventsStack = ({
	query,
	data = [],
	events = [],
	...props
}: EventsStackProps) => {
	return (
		<ResponsiveContainer>
			<BarChart data={data} {...props}>
				<CartesianGrid stroke="#aaa" strokeDasharray="5 5" />
				<XAxis
					dataKey="date"
					tickFormatter={(date) =>
						["s", "m", "h"].includes(query.step)
							? date
							: dayjs(date).format($setting.get("formatDate"))
					}
				/>
				<YAxis />
				<Tooltip
					content={TooltipContentBar}
					labelFormatter={(label) =>
						["s", "m", "h"].includes(query.step)
							? label
							: dayjs(label).format($setting.get("formatDate"))
					}
				/>
				<Legend />
				{events.map((line) => (
					<Bar
						key={line}
						dataKey={line}
						stackId={line === "p" ? "a" : "b"}
						name={ee.findLabelByCode(line)}
						fill={ee.findColorByCode(line)}
						stroke={ee.findColorByCode(line)}
						label={ee.findLabelByCode(line) as any}
						background
					/>
				))}
			</BarChart>
		</ResponsiveContainer>
	);
};

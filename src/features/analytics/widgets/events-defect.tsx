import {
	QueryShow,
	useAnalytics
} from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { randomColorLabel } from "@/entites/labels";
import { LegendContentPieFactory, TooltipContentPie } from "@/shared/ui";
import { AspectRatio, Center, Stack } from "@mantine/core";
import { useMemo, useState } from "react";
import { Legend, Pie, PieChart, ResponsiveContainer, Sector, Tooltip, type LegendPayload, type PieSectorDataItem } from "recharts";

export interface AnalyticEventsDefectProps {
	filterdate: IRequestAnalytics["filterdate"];
	step?: IRequestAnalytics["step"];
	event?: IRequestAnalytics["event"];
}

const aliasCode: Record<string, string> = {
	"Ручная отбраковка": "Ручная отбраковка",
	"Останов оператором": "Останов оператором",
	"Перезапуск линии": "Перезапуск линии",
	"Код в другом агрегате": "Код в другом агрегате",
	"Ошибка обмена с принтером": "Ошибка обмена с принтером",
	"Отбраковано машиной Брак по сигналу машины":
		"Отбраковано машиной Брак по сигналу машины",
	"GTIN кода не по заданию": "GTIN кода не по заданию",
	"Дуплекс дубликат кода Двойное считывание - обе камеры считали один код":
		"Дуплекс дубликат кода Двойное считывание - обе камеры считали один код",
	"Код в статусе ОТБРАКОВАН": "Код в статусе ОТБРАКОВАН",
	"Недостаточно кодов Недостаточно данных для агрегации":
		"Недостаточно кодов Недостаточно данных для агрегации",
	"Код не для этого задания": "Код не для этого задания",
	"Дубликат кода Дубликат в составе": "Дубликат кода: Дубликат в составе",
	"Низкое качество кода": "Низкое качество кода",
	"Налив при браке": "Налив при браке",
	"Некорректная структура кода": "Некорректная структура кода",
	"LINECULLED код": "LINECULLED код",
	"Таймаут сборки агрегата": "Таймаут сборки агрегата",
	"Некорректный код агрегата": "Некорректный код агрегата",
	"Дубликат кода Код не изменён в БД": "Дубликат кода: Код не изменён в БД",
	"Таймаут проверки кода в БД": "Таймаут проверки кода в БД",
	"Некорретная пара кодов": "Некорретная пара кодов",
	"Срок жизни кода истёк": "Срок жизни кода истёк",
	"Дубликат кода Код уже в статусе 'Нанесён (Отчёт о нанесении принят ЧЗ)'":
		"Дубликат кода: Код уже в статусе 'Нанесён (Отчёт о нанесении принят ЧЗ)'",
	"Дубликат кода Код уже в статусе 'Введён в оборот'":
		"Дубликат кода: Код уже в статусе 'Введён в оборот'",
	"Дубликат кода Код уже в статусе 'Верифицирован (Сериализован)'":
		"Дубликат кода: Код уже в статусе 'Верифицирован (Сериализован)'",
	"Неверный размер агрегата": "Неверный размер агрегата",
	"Код не распознан": "Код не распознан",
	"Некорректная пара кодов": "Некорректная пара кодов",
	"Некорректный уровень вложения": "Некорректный уровень вложения",
	"Некорректный уровень влоежния": "Некорректный уровень влоежния",
	"EAN кода не по продукту": "EAN кода не по продукту",
};

function calckDefect(code: string): string {
	for (const str in aliasCode) {
		if (code.includes(str)) {
			return aliasCode[str] || "";
		}
	}

	if (code.includes("Некорректный статус") && code.includes("кода состава")) {
		return "Некорректный статус кода состава";
	}

	if (
		code.includes("Дубликат кода Код") &&
		code.includes("был недавно отканирован")
	) {
		return "Дубликат кода: Код был недавно отканирован";
	}

	if (
		code.includes("Некорректный код агрегата! Код") &&
		code.includes("от другого уровня")
	) {
		return "Дубликат кода: Код был недавно отканирован";
	}

	return "ERROR";
}

const renderActiveShape = ({
		cx,
		cy,
		midAngle,
		innerRadius,
		outerRadius,
		startAngle,
		endAngle,
		fill,
		payload,
		percent,
		value,
		name,
		...props
	}: PieSectorDataItem) => {
	const isSelected = props['data-recharts-item-id'] === name
	const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * (midAngle ?? 1));
  const cos = Math.cos(-RADIAN * (midAngle ?? 1));
  const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
  const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
  const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
  const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
			{isSelected && <>
				<Sector
					cx={cx}
					cy={cy}
					startAngle={startAngle}
					endAngle={endAngle}
					innerRadius={(outerRadius ?? 0) + 6}
					outerRadius={(outerRadius ?? 0) + 10}
					fill={fill}
				/>
				<path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
				<circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
				<text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${name}`}</text>
			</>}
    </g>
  );
};

export const AnalyticEventsDefect = ({
	filterdate,
	step = "d",
	event = "d",
}: AnalyticEventsDefectProps) => {
	const production_id = useStoreUserProfile((state) => state.productions);
	const { data } = useAnalytics({ filterdate, step, event, production_id });

	// Извлекаем, групируем данные
	const ddata = useMemo(() => {
		if (!data) {
			return [];
		}

		const ddata: Record<string, number> = {};

		for (const production of data.production || []) {
			for (const item of production.data) {
				const d = calckDefect(item.data);
				ddata[d] = ddata[d] || 0;
				ddata[d] += item.count;
			}
		}

		return Object.entries(ddata).map(([name, value]) => ({
			name,
			value,
			fill: randomColorLabel(name),
		}));
	}, [data, production_id]);

	const isEmpty = useMemo(() => !ddata.length, [ddata]);
	
	const [selected, setSelected] = useState<string>();
	const onLegendClick = (arg: LegendPayload) => {
		setSelected(v=> v === arg.value? '': arg.value)
	};


	return (
		<Stack h="100%">
			{isEmpty ? (
				<Center w="100%" h="100%" fz="h1" c="dimmed" ta='center'>
					Данные ненашлись!<br />
					За <QueryShow filterdate={filterdate} step={step} event={event} />
				</Center>
			) : (
				<AspectRatio ratio={16 / 9}>
					<ResponsiveContainer>
						<PieChart>
							<Tooltip content={TooltipContentPie} />
							<Legend
								align="left"
								layout="vertical"
								verticalAlign="top"
								width='50%'
								content={LegendContentPieFactory(selected)}
								onClick={onLegendClick}
							/>
							<Pie
								shape={renderActiveShape}
								id={selected}
								data={ddata}
								width='50%'
								dataKey="value"
								nameKey="name"
								cx="50%"
								cy="50%"
							/>
						</PieChart>
					</ResponsiveContainer>
				</AspectRatio>
			)}
		</Stack>
	);
};

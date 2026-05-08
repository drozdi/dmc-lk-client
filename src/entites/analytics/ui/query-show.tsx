import { $setting } from "@/shared";
import dayjs from "dayjs";

//"s" | "m" | "h" | "d" | "mon" | "y" | "w"

const stepLabel = {
	s: "секундам",
	m: "минутам",
	h: "часам",
	d: "дням",
	w: "неделям",
	mon: "месяцам",
	y: "годам",
};

const labels = {
	in: {
		s: "секуны",
		m: "минуты",
		h: "часы",
		d: "дни",
		w: "недели",
		mon: "месяца",
		y: "года",
	},
	by: {
		s: "секундам",
		m: "минутам",
		h: "часам",
		d: "дням",
		w: "неделям",
		mon: "месяцам",
		y: "годам",
	},
}

export interface QueryFilterdateShowProps extends IRequestAnalytics { 
	type?: 'in' | 'by' | '' | false
}

function showStep(type: QueryFilterdateShowProps['type'], step: SliceStep): string {
	if (type === 'in' || type === 'by') {
		return ` ${type === 'in'? 'за' : 'по'} ${labels[type][step]}`
	}
	return ''
}

export function QueryShow({
	filterdate,
	step,
	type = ''
}: QueryFilterdateShowProps) {
	if (step === 's') {
		return `${dayjs(filterdate[0]).format('ss')} - ${dayjs(filterdate[1]).format('ss')}${showStep(type, step)}`
	} else if (step === 'm') {
		return `${dayjs(filterdate[0]).format('mm')} - ${dayjs(filterdate[1]).format('mm')}${showStep(type, step)}`
	} else if (step === 'h') {
		return `${dayjs(filterdate[0]).format('HH')} - ${dayjs(filterdate[1]).format('HH')}${showStep(type, step)}`
	}
	return `${dayjs(filterdate[0]).format($setting.get('formatDate'))} - ${dayjs(filterdate[1]).format($setting.get('formatDate'))}${showStep(type, step)}`
}

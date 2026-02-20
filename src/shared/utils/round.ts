export function round(val: number, step = 100): number {
	return Math.round(val * step) / step;
}

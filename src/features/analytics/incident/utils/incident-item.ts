export function getIncidentItemKey(
	item: IAnalyticsIncidentItem,
	index: number,
): string {
	const id = item.id != null ? String(item.id).trim() : "";

	if (id) {
		return `${index}-${id}`;
	}

	return `incident-${index}`;
}

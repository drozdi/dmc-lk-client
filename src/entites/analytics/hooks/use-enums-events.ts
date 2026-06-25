import { mapEvents } from "../constants";
import {
	eventsDataSelect,
	eventsFindByCode,
	eventsFindColorByCode,
	eventsFindLabelByCode,
} from "../constants/enums-data";

export { eventsDataSelect, eventsFindByCode, eventsFindColorByCode, eventsFindLabelByCode };

export function useEnumsEvents() {
	return {
		isLoading: false,
		data: mapEvents,
		keys: Object.keys(mapEvents),
		dataSelect: eventsDataSelect,
		findByCode: eventsFindByCode,
		findLabelByCode: eventsFindLabelByCode,
		findColorByCode: eventsFindColorByCode,
	};
}

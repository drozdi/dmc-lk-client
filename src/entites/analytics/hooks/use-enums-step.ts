import { mapStep } from "../constants";
import {
	stepDataSelect,
	stepFindByCode,
	stepFindLabelByCode,
} from "../constants/enums-data";

export { stepDataSelect, stepFindByCode, stepFindLabelByCode };

export function useEnumsStep() {
	return {
		isLoading: false,
		data: mapStep,
		dataSelect: stepDataSelect,
		findByCode: stepFindByCode,
		findLabelByCode: stepFindLabelByCode,
	};
}

import { debounce } from '../utils'
const validation = (value: any, rules: Function[] = []) => {
	return rules.map(rule => rule(value)).filter(v => v !== true)
}

export function useFormAction({ data, rules }) {
	const [errors, setErrors] = useState(validation(value, rules))
	const checkValue = useCallback(
		debounce((value: any) => {
			setErrors(validation(value, rules))
		}, 200),
		[rules]
	)
}

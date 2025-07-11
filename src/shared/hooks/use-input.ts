import { useCallback, useState } from 'react'
import { debounce } from '../utils'
const validation = (value: any, rules: Function[] = []) => {
	return rules.map(rule => rule(value)).filter(v => v !== true)
}
export const useInput = ({
	value: initialValue,
	onBlur,
	onChange,
	rules = [],
}: {
	value: any
	onBlur?: (e: React.MouseEvent) => void
	onChange?: (e: React.MouseEvent) => void
	rules?: Array<(value: any) => boolean | string>
}) => {
	const [value, setValue] = useState(initialValue)
	const [dirty, setDirty] = useState(false)
	const [errors, setErrors] = useState(validation(value, rules))

	const checkValue = useCallback(
		debounce((value: any) => {
			setErrors(validation(value, rules))
		}, 200),
		[rules]
	)

	return {
		value,
		dirty,
		errors,
		onBlur: (e: React.MouseEvent) => {
			onBlur?.(e)
			setDirty(true)
		},
		onChange: (e: React.MouseEvent) => {
			setValue(e.target.value)
			checkValue(e.target.value)
			onBlur?.(e)
		},
	}
}

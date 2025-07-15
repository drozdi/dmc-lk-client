import { Input } from './Input'
import './style.css'

interface SelectProps {
	color?: string
	dense?: boolean
	underlined?: boolean
	filled?: boolean
	square?: boolean
	outline?: boolean
	stackLabel?: boolean
	className?: string
	label?: string
	value?: string
	placeholder?: string
	required?: boolean
	disabled?: boolean
	readOnly?: boolean
	type?: string
	id?: string
	name?: string
	autoComplete?: string
	autoFocus?: boolean
	ariaLabel?: string
	ariaDescribedBy?: string
	ariaInvalid?: boolean
	ariaRequired?: boolean
	ariaLabelledby?: string
	ariaValueText?: string
	ariaValueNow?: number
	ariaValueMin?: number
	ariaValueMax?: number
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void
	lazyRules?: boolean
	hint?: string
	hideHint?: boolean
	hideMessage?: boolean
	errorMessage?: string
	rules?: Function[]
	[key: string]: any
}

export const Select = (props: SelectProps) => <Input {...props} as='select' />

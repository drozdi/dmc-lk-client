import { useCallback, useEffect, useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { render } from '../../internal/render'
import { cls, debounce } from '../../utils'
import { InputError } from './InputError'
import { InputHint } from './InputHint'
import { InputLabel } from './InputLabel'
import { InputMessages } from './InputMessages'
import './style.css'

interface InputProps {
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

const validation = (value: any, rules: Function[] = []) => {
	return rules.map(rule => rule(value)).filter(v => v !== true)
}

export const Input = ({
	color,
	dense,
	square,
	underlined,
	filled,
	outline,
	stackLabel,
	id,
	type = 'text',
	label,
	className,
	required,
	disabled,
	value,
	rules = [],
	onBlur,
	lazyRules,
	hint,
	hideHint,
	hideMessage,
	errorMessage,
	...props
}: InputProps) => {
	const uid = uuid(id as any)

	const [dirty, setDirty] = useState<boolean>(false)
	const [errors, setErrors] = useState<string[]>(
		!lazyRules ? validation(value, rules) : []
	)
	const error = useMemo(() => errors.length > 0, [errors])
	const checkValue = useCallback(
		debounce((value: any) => {
			setErrors(validation(value, rules))
		}, 200),
		[]
	)
	const handlerBlur = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setDirty(true)
			onBlur?.(e)
		},
		[onBlur]
	)

	useEffect(() => {
		checkValue(value)
	}, [value, checkValue])

	const isError = !!errorMessage || (dirty && error)
	const errorMes = errorMessage || errors[0] || ''
	const modColor = isError ? 'negative' : color
	return (
		<>
			<div
				className={cls('mdc-input', {
					'mdc-input--dense': dense,
					'mdc-input--square': square,
					'mdc-input--filled': filled,
					'mdc-input--outline': outline,
					'mdc-input--underlined': underlined,
					'mdc-input--disabled': disabled,
					'mdc-input--stack-label': stackLabel,
					[`mdc-input--${modColor}`]: !!modColor,
				})}
			>
				<div className='mdc-input-container'>
					<div className='mdc-input-underlay'></div>
					<div className='mdc-input-outline'>
						<div className='mdc-input-outline-start'></div>
						<div className='mdc-input-outline-notch'>
							<InputLabel required={required}>{label}</InputLabel>
						</div>
						<div className='mdc-input-outline-end'></div>
					</div>
					<div className='mdc-input-underlined'></div>
					{render('input', {
						...props,
						value: value,
						required: required,
						disabled: disabled,
						type,
						id: uid,
						onBlur: handlerBlur,
						className: 'mdc-input-native',
					})}
					<InputLabel required={required} htmlFor={uid}>
						{label}
					</InputLabel>
				</div>
				<InputMessages
					hideMessage={hideMessage}
					hideHint={hideHint}
					error={isError}
				>
					{hint && <InputHint>{hint}</InputHint>}
					{isError && <InputError>{errorMes}</InputError>}
				</InputMessages>
			</div>
		</>
	)
}

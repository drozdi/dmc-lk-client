import { useCallback, useEffect, useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { render } from '../../internal/render'
import { cls, debounce } from '../../utils'
import { DmcInputError } from './DmcInputError'
import { DmcInputHint } from './DmcInputHint'
import { DmcInputLabel } from './DmcInputLabel'
import { DmcInputMessages } from './DmcInputMessages'
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
	onChange?: (e: React.ChangeEvent) => void
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

export const DmcInput = ({
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
				className={cls('dmc-input', {
					'dmc-input--dense': dense,
					'dmc-input--square': square,
					'dmc-input--filled': filled,
					'dmc-input--outline': outline,
					'dmc-input--underlined': underlined,
					'dmc-input--disabled': disabled,
					'dmc-input--stack-label': stackLabel,
					[`dmc-input--${modColor}`]: !!modColor,
				})}
			>
				<div className='dmc-input-container'>
					<div className='dmc-input-underlay'></div>
					<div className='dmc-input-outline'>
						<div className='dmc-input-outline-start'></div>
						<div className='dmc-input-outline-notch'>
							<DmcInputLabel required={required}>{label}</DmcInputLabel>
						</div>
						<div className='dmc-input-outline-end'></div>
					</div>
					<div className='dmc-input-underlined'></div>
					{render('input', {
						...props,
						value: value,
						required: required,
						disabled: disabled,
						type,
						id: uid,
						onBlur: handlerBlur,
						className: 'dmc-input-native',
					})}
					<DmcInputLabel required={required} htmlFor={uid}>
						{label}
					</DmcInputLabel>
				</div>
				<DmcInputMessages
					hideMessage={hideMessage}
					hideHint={hideHint}
					error={isError}
				>
					{hint && <DmcInputHint>{hint}</DmcInputHint>}
					{isError && <DmcInputError>{errorMes}</DmcInputError>}
				</DmcInputMessages>
			</div>
		</>
	)
}

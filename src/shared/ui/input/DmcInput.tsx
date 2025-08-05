import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { cls, debounce } from '../../utils'
import { DmcInputBase } from './DmcInputBase'
import { DmcInputError } from './DmcInputError'
import { DmcInputHint } from './DmcInputHint'
import { DmcInputMessages } from './DmcInputMessages'
import './style.css'
import { processSection } from './utils'

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

export const DmcInput = forwardRef(
	(
		{
			color,
			dense,
			square,
			underlined,
			filled,
			outline,
			stackLabel,
			id,
			type = 'text',
			className,
			required,
			disabled,
			before: propsBefore,
			after: propsAfter,
			value,
			rules = [],
			onBlur,
			lazyRules,
			labelColor,
			hint,
			hideHint,
			hideMessage,
			errorMessage,
			...props
		}: InputProps,
		ref
	) => {
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
		const modColor = isError ? 'warning' : color

		const before = processSection(propsBefore, 'dmc-input-before')
		const after = processSection(propsAfter, 'dmc-input-after')
		return (
			<>
				<div
					className={cls(
						'dmc-input',
						{
							'dmc-input--dense': dense,
							'dmc-input--square': square,
							'dmc-input--filled': filled,
							'dmc-input--outline': outline,
							'dmc-input--underlined': underlined,
							'dmc-input--disabled': disabled,
							'dmc-input--stack-label': stackLabel,
							[`dmc-input--${modColor}`]: !!modColor,
						},
						className
					)}
				>
					{before}

					<DmcInputBase
						{...props}
						ref={ref}
						value={value}
						required={required}
						disabled={disabled}
						labelColor={labelColor || modColor}
						type={type}
						id={uid}
						onBlur={handlerBlur}
					/>

					{after}

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
)

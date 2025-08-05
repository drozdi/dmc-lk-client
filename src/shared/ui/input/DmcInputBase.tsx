import { forwardRef } from 'react'
import { v4 as uuid } from 'uuid'
import { render } from '../../internal/render'
import { DmcInputLabel } from './DmcInputLabel'
import './style.css'
import { processSection } from './utils'

interface DmcInputBaseProps {
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
	[key: string]: any
}

export const DmcInputBase = forwardRef(
	(
		{
			id,
			label,
			labelColor,
			required,
			leftSection: propsLeftSection,
			rightSection: propsRightSection,
			...other
		}: DmcInputBaseProps,
		ref
	) => {
		const uid = uuid(id as any)
		//const ctx = useXInputControlContext();

		const leftSection = processSection(propsLeftSection)
		const rightSection = processSection(propsRightSection)
		return (
			<div className='dmc-input-container'>
				{leftSection}
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
					...other,
					id: uid,
					ref: ref,
					required: required,
					className: 'dmc-input-native',
				})}
				<DmcInputLabel color={labelColor} required={required} htmlFor={uid}>
					{label}
				</DmcInputLabel>
				{rightSection}
			</div>
		)
	}
)

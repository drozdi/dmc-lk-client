//todo add styles label over border
import { useMemo } from 'react'
import { useId } from '../../hooks/use-id'
import { render } from '../../internal/render'
import { isString } from '../../utils/is'
import { XIcon } from '../icon/index copy'
import './style.css'
import { useXInputControlContext } from './XInputControlContext'
import { XInputLabel } from './XInputLabel'

export const InputBase = ({
	id,
	label,
	labelColor,
	required,
	leftSection: propsLeftSection,
	rightSection: propsRightSection,
	...other
}) => {
	const ctx = useXInputControlContext()
	const uid = useId(ctx?.inputId || id)
	const leftSection = useMemo(
		() =>
			isString(propsLeftSection) ? (
				<XIcon>{propsLeftSection}</XIcon>
			) : (
				propsLeftSection
			),
		[propsLeftSection]
	)
	const rightSection = useMemo(
		() =>
			isString(propsRightSection) ? (
				<XIcon>{propsRightSection}</XIcon>
			) : (
				propsRightSection
			),
		[propsRightSection]
	)

	return (
		<div className='mdc-input-container'>
			{propsLeftSection && (
				<span className='mdc-input-section'>{leftSection}</span>
			)}
			<div className='mdc-input-underlay'></div>

			<div className='mdc-input-outline'>
				<div className='mdc-input-outline-start'></div>
				<div className='mdc-input-outline-notch'>
					<XInputLabel required={required}>{label}</XInputLabel>
				</div>
				<div className='mdc-input-outline-end'></div>
			</div>

			<div className='mdc-input-underlined'></div>

			{render(
				'input',
				{
					...other,
					id: uid,
					required,
					className: 'mdc-input-native',
					ref,
				},
				{ required }
			)}

			<XInputLabel
				id={ctx?.labelId}
				htmlFor={uid}
				color={labelColor}
				required={required}
			>
				{label}
			</XInputLabel>

			{propsRightSection && (
				<span className='mdc-input-section'>{rightSection}</span>
			)}
		</div>
	)
}

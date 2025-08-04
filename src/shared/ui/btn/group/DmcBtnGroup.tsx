import { useLayoutEffect, useMemo, useState } from 'react'
import { cls } from '../../../utils'
import { DmcBtnGroupProvider } from './DmcBtnGroupContext'
import './style.css'

import { scopedKeydownHandler } from '../../../internal/events/scoped-keydown-handler'
interface BtnGroupProps {
	children?: React.ReactNode
	className?: string
	selectable?: boolean
	switchable?: boolean
	multiple?: boolean
	vertical?: boolean
	separator?: boolean
	onClick?: React.MouseEvent
	onChange?: React.ChangeEvent
	value: any
	align?: 'start' | 'center' | 'end'
	grow?: boolean
	pills?: boolean
	name?: string
	disabled?: boolean
}
export function DmcBtnGroup({
	children,
	className,
	selectable,
	switchable,
	multiple,
	vertical,
	separator,
	onClick,
	onChange,
	value: propsValue,
	align,
	grow,
	pills,
	name,
	disabled,
	...props
}: BtnGroupProps) {
	const [current, setCurrent] = useState(
		multiple ? [].concat(propsValue) : propsValue ?? undefined
	)

	const eventValue = (event, value) => ({
		...event,
		value: value,
		target: {
			...event.target,
			name: props.name,
			id: props.id,
			value: value,
		},
		stopPropagation: () => {
			event.stopPropagation?.()
		},
		preventDefault: () => {
			event.preventDefault?.()
		},
	})

	const handleChange = (event, value) => {
		onChange?.(eventValue(event, value))
		setCurrent(() => value)
	}

	const handleClick = (event, value) => {
		if (disabled) {
			return
		}

		onClick?.(eventValue(event, value))

		if (switchable) {
			handleChange(event, value)
			return
		}
		if (!selectable) {
			return
		}

		let newValue
		if (multiple) {
			newValue = [].concat(current)
			if (!newValue.includes(value)) {
				newValue.push(value)
			} else {
				newValue = newValue.filter(v => v !== value)
			}
		} else {
			newValue = current === value ? undefined : value
		}

		handleChange(event, newValue)
	}

	const context = useMemo(
		() => ({
			props: {
				...props,
				onKeyDown: scopedKeydownHandler({
					parentSelector: '[role="group"]',
					siblingSelector: '[role="button"], button',
					loop: true,
					activateOnFocus: false,
					orientation: 'xy',
				}),
			},
			switchable,
			selectable,
			multiple,
			value: propsValue,
			onChange: handleClick,
			isDisabled: (value: any): boolean | undefined => {
				return disabled
			},
			isActive: (value: any): boolean | undefined => {
				if (switchable) {
					return current === value
				}
				if (!selectable) {
					return false
				}
				if (multiple && Array.isArray(current)) {
					return current.includes(value)
				}
				return current === value
			},
		}),
		[current, switchable, selectable, multiple, disabled, props]
	)

	useLayoutEffect(() => {
		let newValue
		if (Array.isArray(current) && !multiple) {
			newValue = current[0] ?? undefined
		} else if (!Array.isArray(current) && multiple) {
			newValue = current ? [current] : []
		} else {
			newValue = multiple ? [] : undefined
		}
		handleChange({}, newValue)
	}, [multiple])
	useLayoutEffect(() => {
		setCurrent(() =>
			multiple ? [].concat(propsValue) : propsValue ?? undefined
		)
	}, [propsValue])

	return (
		<div
			className={cls('dmc-btn-group', className, {
				'dmc-btn-group--vertical': vertical,
				'dmc-btn-group--separator': !pills && !props.round && separator,
				'dmc-btn-group--grow': grow,
				'dmc-btn-group--pills': pills,
				'dmc-btn-group--round': props.round,
				[`justify-${align}`]: !vertical && align,
				[`items-${align}`]: vertical && align,
			})}
			role='group'
		>
			<DmcBtnGroupProvider value={context}>{children}</DmcBtnGroupProvider>
		</div>
	)
}

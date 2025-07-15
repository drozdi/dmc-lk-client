import { useEffect, useState } from 'react'
import { TbChevronDown } from 'react-icons/tb'
import { Sections } from '../../internal/sections'
import { cls } from '../../utils'
import { Collapse } from '../collapse'
import './style.css'

interface LinkProps {
	className?: string
	children?: React.ReactNode
	noWrap?: boolean
	active?: boolean
	disabled?: boolean
	label?: string
	description?: string
	leftSection?: React.ReactNode
	rightSection?: React.ReactNode
	opened?: boolean
	onClick?: (event: React.MouseEvent) => void
	onKeyDown?: (event: React.KeyboardEvent) => void
	[key: string]: any
}

export function Link({
	className,
	children,
	noWrap,
	active,
	disabled,
	label,
	description,
	leftSection,
	rightSection,
	opened: _opened,
	onClick,
	onKeyDown,
	...props
}: LinkProps) {
	const withChildren = !!children
	const [opened, setOpened] = useState(_opened)

	const handleClick = (event: React.MouseEvent) => {
		if (disabled) {
			event.preventDefault()
			return
		}
		onClick?.(event)
		if (withChildren) {
			event.preventDefault()
			setOpened(v => !v)
		}
	}

	const handleKeyDown = (event: React.KeyboardEvent) => {
		onKeyDown?.(event)
		if (event.code === 'Space' && withChildren) {
			event.preventDefault()
			setOpened(v => !v)
		}
	}

	useEffect(() => setOpened(_opened), [_opened])

	return (
		<>
			<Sections
				as='a'
				{...props}
				square
				aria-label={typeof label === 'string' ? label : undefined}
				disabled={disabled}
				aria-disabled={disabled}
				className={({ isActive }) =>
					cls(
						'mdc-link',
						{
							'mdc-link--nowrap': noWrap,
							'mdc-link--active': active || isActive,
							'mdc-link--opened': opened,
							'mdc-link--disabled': disabled,
						},
						className
					)
				}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
				bodyClass='mdc-link-body'
				leftSection={leftSection}
				rightSection={
					withChildren ? (
						<TbChevronDown className='mdc-link-chevron' />
					) : (
						rightSection
					)
				}
			>
				<span className='mdc-link-label'>{label}</span>
				<span className='mdc-link-description'>{description}</span>
			</Sections>
			<Collapse active={opened}>
				<div className='mdc-link-childrens'>{children}</div>
			</Collapse>
		</>
	)
}

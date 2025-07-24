import { memo } from 'react'
import { TbX } from 'react-icons/tb'
import { v4 as uuid } from 'uuid'
import { useTimeout } from '../../hooks'
import { Sections } from '../../internal/sections'
import { cls } from '../../utils'
import { DmcBtn } from '../btn'
import { DmcSpinner } from '../spinner'
import './style.css'

interface MessageProps {
	children?: React.ReactNode
	id?: string
	className?: string
	label?: React.ReactNode
	description?: React.ReactNode
	icon?: React.ReactElement
	flat?: boolean
	color?:
		| 'primary'
		| 'secondary'
		| 'success'
		| 'warning'
		| 'danger'
		| 'accent'
		| 'info'
	outline?: boolean
	square?: boolean
	underlined?: 'top' | 'bottom' | 'left' | 'right'
	filled?: boolean
	loading?: boolean
	life?: number
	sticky?: boolean
	onClose?: () => void
}

export const DmcMessage = memo(
	({
		id,
		className,
		children,
		label,
		description,
		flat,
		icon,
		color,
		outline,
		square,
		underlined,
		filled,
		loading,
		onClose,
		life = 3000,
		sticky,
	}: MessageProps) => {
		const uid = uuid(id as any)
		useTimeout(() => onClose?.(), life, sticky)
		return (
			<Sections
				id={uid}
				role='alert'
				aria-live={onClose ? 'assertive' : 'polite'}
				aria-atomic='true'
				className={cls(
					'dmc-message',
					{
						[`dmc-message--${color}`]: color,
						'dmc-message--square': square,
						'dmc-message--outline': outline,
						'dmc-message--filled': filled,
						'dmc-message--flat': flat,
						[`dmc-message--underlined-${underlined}`]: underlined,
					},
					className
				)}
				classBody='dmc-message-body'
				leftSection={loading ? <DmcSpinner thickness={5} /> : icon}
				rightSection={
					onClose && (
						<div className='dmc-message--close'>
							<DmcBtn
								leftSection={<TbX />}
								size='xs'
								flat
								plain
								onClick={onClose}
							/>
						</div>
					)
				}
			>
				<div className='dmc-message-label'>{label}</div>
				<div className='dmc-message-description'>{children ?? description}</div>
			</Sections>
		)
	}
)

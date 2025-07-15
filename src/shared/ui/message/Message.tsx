import { memo } from 'react'
import { TbX } from 'react-icons/tb'
import { v4 as uuid } from 'uuid'
import { Sections } from '../../internal/sections'
import { cls } from '../../utils'
import { Btn } from '../btn'
import { Spinner } from '../spinner'
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
	closable?: boolean
	loading?: boolean
	life?: number
	sticky?: boolean
}

export const Message = memo(
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
		closable,
		loading,
		life = 3000,
		sticky,
	}: MessageProps) => {
		const uid = uuid(id as any)
		const isClosable = false

		return (
			<Sections
				id={uid}
				role='alert'
				/*aria-live={toast ? 'assertive' : 'polite'}*/
				aria-atomic='true'
				className={cls(
					'mdc-message',
					{
						[`mdc-message--${color}`]: color,
						'mdc-message--square': square,
						'mdc-message--outline': outline,
						'mdc-message--filled': filled,
						'mdc-message--flat': flat,
						[`mdc-message--underlined-${underlined}`]: underlined,
					},
					className
				)}
				classBody='mdc-message-body'
				leftSection={loading ? <Spinner thickness='5' /> : icon}
				rightSection={
					isClosable && (
						<div className='mdc-message--close'>
							<Btn
								leftSection={<TbX />}
								size='xs'
								flat
								plain
								/*onClick={handleClose}*/
							/>
						</div>
					)
				}
			>
				<div className='mdc-message-label'>{label}</div>
				<div className='mdc-message-description'>{children ?? description}</div>
			</Sections>
		)
	}
)

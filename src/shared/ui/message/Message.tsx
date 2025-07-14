import { memo } from 'react'
import { v4 as uuid } from 'uuid'
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
	icon?: React.ReactNode
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
			<div
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
			>
				{/*icon && !loading && Icon*/}
				{loading && <Spinner thickness='5' />}
				<div className='mdc-message-body'>
					<div className='mdc-message-label'>{label}</div>
					<div className='mdc-message-description'>
						{children ?? description}
					</div>
				</div>
				{isClosable && (
					<div className='mdc-message--close'>
						<Btn
							leftSection='mdi-close'
							size='sm'
							flat
							plain
							/*onClick={handleClose}*/
						/>
					</div>
				)}
			</div>
		)
	}
)

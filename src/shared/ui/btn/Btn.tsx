import { cls } from '../../utils'
import { Spinner } from '../spinner'
import './style.css'

interface BtnProps {
	children?: React.ReactNode
	className?: string
	type?: string
	color?:
		| 'primary'
		| 'secondary'
		| 'success'
		| 'warning'
		| 'danger'
		| 'accent'
		| 'info'
	size?: 'xs' | 'md' | 'lg'
	flat?: boolean
	text?: boolean
	tonal?: boolean
	plain?: boolean
	outline?: boolean
	block?: boolean
	square?: boolean
	round?: boolean
	rounded?: boolean
	loading?: boolean
}

export const Btn = ({
	children,
	className,
	color,
	size,
	flat,
	text,
	tonal,
	plain,
	outline,
	block,
	square,
	round,
	rounded,
	loading,
	...props
}: BtnProps) => {
	return (
		<button
			{...props}
			className={cls(
				'mdc-btn',
				{
					'mdc-btn--flat': flat,
					'mdc-btn--text': text,
					'mdc-btn--tonal': tonal,
					'mdc-btn--plain': plain,
					'mdc-btn--outline': outline,
					'mdc-btn--block': block,
					'mdc-btn--square': square,
					'mdc-btn--round': round,
					'mdc-btn--rounded': rounded,
					'mdc-btn--loading': loading,
					[`mdc-btn--${color}`]: color,
					[`mdc-btn--${size}`]: size,
				},
				className
			)}
		>
			<span className='mdc-btn-content'>{children}</span>
			<span className='mdc-btn-loader'>
				<Spinner size='2em' thickness={5} />
			</span>
		</button>
	)
}

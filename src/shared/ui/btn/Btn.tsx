import { cls } from '../../utils'
import './style.css'

interface BtnProps {
	children?: React.ReactNode
	className?: string
	type?: string
	color?: 'primary' | 'secondary' | 'danger'
	size?: 'small' | 'medium' | 'large'
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
			<span className='x-btn-content'>{children}</span>
			<span className='mdc-btn-loader'>
				<svg
					className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
				>
					<circle
						className='opacity-25'
						cx='12'
						cy='12'
						r='10'
						stroke='currentColor'
						strokeWidth='4'
					></circle>
					<path
						className='opacity-75'
						fill='currentColor'
						d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
					></path>
				</svg>
				Loading...
			</span>
		</button>
	)
}

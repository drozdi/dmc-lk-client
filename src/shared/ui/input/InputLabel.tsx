import { cls } from '../../utils'
import './style.css'
interface InputLabelProps {
	children?: React.ReactNode
	htmlFor?: string
	color?: string
	required?: boolean
	className?: string
}

export const InputLabel = ({
	className,
	children,
	htmlFor,
	color,
	required,
	...props
}: InputLabelProps) => {
	if (!children) {
		return null
	}
	return (
		<label
			{...props}
			htmlFor={htmlFor}
			className={cls(
				'mdc-input-label',
				color ? 'text-' + color : '',
				className
			)}
		>
			{children}
			{required && (
				<span className='text-negative' aria-hidden>
					{' *'}
				</span>
			)}
		</label>
	)
}

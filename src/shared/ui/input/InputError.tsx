import { v4 as uuid } from 'uuid'
import { cls } from '../../utils'
import './style.css'
interface InputErrorProps {
	children?: React.ReactNode
	id?: string
	className?: string
}

export const InputError = ({
	id,
	className,
	children,
	...props
}: InputErrorProps) => {
	if (!children) {
		return null
	}
	const uid = uuid(id as any)
	return (
		<p
			id={uid}
			{...props}
			className={cls('mdc-input-message mdc-input-message--error', className)}
		>
			{children}
		</p>
	)
}

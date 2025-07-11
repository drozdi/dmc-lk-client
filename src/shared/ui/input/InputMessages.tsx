import { cls } from '../../utils'
import './style.css'

interface InputMessagesProps {
	children?: React.ReactNode
	className?: string
	hideMessage?: boolean
	hideHint?: boolean
	error?: boolean
}
export function InputMessages({
	className,
	children,
	hideMessage,
	error,
	hideHint,
	...props
}: InputMessagesProps) {
	return (
		!hideMessage && (
			<div
				{...props}
				className={cls('mdc-input-messages', {
					'mdc-input-messages--hint': !error && !hideHint,
					'mdc-input-messages--error': error,
				})}
				role='alert'
				aria-live='polite'
			>
				{children}
			</div>
		)
	)
}

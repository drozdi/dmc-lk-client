import { cls } from '../../utils'
import './style.css'

interface InputMessagesProps {
	children?: React.ReactNode
	className?: string
	hideMessage?: boolean
	hideHint?: boolean
	error?: boolean
}
export function DmcInputMessages({
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
				className={cls('dmc-input-messages', {
					'dmc-input-messages--hint': !error && !hideHint,
					'dmc-input-messages--error': error,
				})}
				role='alert'
				aria-live='polite'
			>
				{children}
			</div>
		)
	)
}

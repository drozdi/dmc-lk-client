import { createPortal } from 'react-dom'
import { TbArrowsMinimize, TbArrowsMove } from 'react-icons/tb'
import { useDisclosure } from '../../hooks'
import { cls } from '../../utils'
import './style.css'

interface FullscreenProps {
	children?: React.ReactNode
}
export function Fullscreen({ children }: FullscreenProps) {
	const [active, { toggle, close, open }] = useDisclosure(false)
	const element = (
		<div
			className={cls('mdc-fullscreen', {
				'mdc-fullscreen--active': active,
			})}
		>
			<button
				className='mdc-fullscreen-btn mdc-fullscreen-btn--open'
				onClick={open}
			>
				<TbArrowsMove />
			</button>
			<button
				className='mdc-fullscreen-btn mdc-fullscreen-btn--close'
				onClick={close}
			>
				<TbArrowsMinimize />
			</button>
			{children}
		</div>
	)
	if (active) {
		return createPortal(element, document.body)
	}

	return element
}

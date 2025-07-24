import { TbArrowsMinimize, TbArrowsMove } from 'react-icons/tb'
import { useDisclosure } from '../../hooks'
import { cls } from '../../utils'
import './style.css'

interface FullscreenProps {
	children?: React.ReactNode
}
export function DmcFullscreen({ children }: FullscreenProps) {
	const [active, { toggle, close, open }] = useDisclosure(false)

	return (
		<div
			className={cls('dmc-fullscreen', {
				'dmc-fullscreen--active': active,
			})}
		>
			<button
				className='dmc-fullscreen-btn dmc-fullscreen-btn--open'
				onClick={open}
			>
				<TbArrowsMove />
			</button>
			<button
				className='dmc-fullscreen-btn dmc-fullscreen-btn--close'
				onClick={close}
			>
				<TbArrowsMinimize />
			</button>
			{children}
		</div>
	)
}

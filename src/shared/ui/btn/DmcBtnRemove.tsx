import { TbCircleX } from 'react-icons/tb'
import { DmcBtn } from './DmcBtn'

export function DmcBtnRemove({ children = <TbCircleX />, ...props }) {
	return (
		<DmcBtn color='warning' {...props}>
			{children}
		</DmcBtn>
	)
}

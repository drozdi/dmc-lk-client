import { TbCircleX } from 'react-icons/tb'
import { DmcBtn } from './DmcBtn'

export function DmcBtnRemove(props) {
	return (
		<DmcBtn color='warning' {...props}>
			<TbCircleX />
		</DmcBtn>
	)
}

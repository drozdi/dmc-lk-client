import { useNavigate } from 'react-router'
import { DmcBtn } from '../../shared/ui'
import { Slot } from '../context/template'

export function Footer() {
	const navigate = useNavigate()
	return (
		<footer className='absolute lg:fixed bottom-0 right-0 flex justify-end w-full bg-white border-gray-200 z-40 dark:border-gray-800 dark:bg-gray-900 border-t p-3 gap-3'>
			<Slot name='footer'>Бла-бла-бла-бла-бла-бла</Slot>
			<DmcBtn color='dark' onClick={() => navigate(-1)}>
				Назад
			</DmcBtn>
		</footer>
	)
}

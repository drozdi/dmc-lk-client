import { useNavigate } from 'react-router'
import { Btn } from '../../shared/ui'
import { useFooter } from '../context/footer'

export function Footer() {
	const { footer } = useFooter()
	const navigate = useNavigate()
	return (
		<footer className='absolute lg:fixed bottom-0 right-0 flex justify-end w-full bg-white border-gray-200 z-40 dark:border-gray-800 dark:bg-gray-900 border-t p-3 gap-3'>
			{footer}
			<Btn color='dark' onClick={() => navigate(-1)}>
				Назад
			</Btn>
		</footer>
	)
}

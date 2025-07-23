import { useFooter } from '../context/footer'

export function Footer() {
	const { footer } = useFooter()
	return (
		<footer className='absolute bottom-0 flex w-full bg-white border-gray-200 z-40 dark:border-gray-800 dark:bg-gray-900 lg:border-t px-3 py-3'>
			{footer}
		</footer>
	)
}

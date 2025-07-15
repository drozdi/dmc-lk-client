import { TbMoon, TbSun } from 'react-icons/tb'
import { useTheme } from '../context/theme'

export const ThemeToggleButton: React.FC = () => {
	const { toggleTheme, theme } = useTheme()

	return (
		<button
			onClick={toggleTheme}
			className='relative flex items-center justify-center text-2xl text-gray-500 transition-colors cursor-pointer bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
		>
			<TbSun className='hidden dark:block' />
			<TbMoon className='dark:hidden' />
		</button>
	)
}

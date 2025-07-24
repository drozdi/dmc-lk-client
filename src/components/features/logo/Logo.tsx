import { Link } from 'react-router'
import { cls } from '../../../shared/utils'
export function Logo({ className }: { className?: string }) {
	return (
		<Link
			to='/'
			className={cls(
				'leading-none text-center no-underline text-blue-700 dark:text-blue-300 transition-all ease-in-out duration-300',
				className
			)}
		>
			<h1 className='text-5xl'>DMC</h1>
			<div className='text-sm line-h'>личный кабинет</div>
		</Link>
	)
}

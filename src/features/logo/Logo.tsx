import { Link } from 'react-router'
import { cls } from '../../shared/utils'
export function Logo({ className }: { className?: string }) {
	return (
		<Link
			to='/'
			className={cls('leading-none text-center no-underline transition-all ease-in-out duration-300', className)}
		>
			<img src='/assests/Logo_DMC_512.png' />
		</Link>
	)
}

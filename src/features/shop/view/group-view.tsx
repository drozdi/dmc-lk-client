import { cls } from '../../../shared/utils'

interface GroupViewProps {
	className?: string
	item: IShopGroup
	onClick?: (e: React.MouseEvent) => void
	[key: string]: any
}

export function GroupView({ item, className, ...props }: GroupViewProps) {
	const urlPic = '/assests/shop/folder.jpg'
	return (
		<div
			{...props}
			className={cls(
				'w-full max-w-sm mx-auto rounded-xs shadow-md overflow-hidden',
				props.onClick && 'cursor-pointer',
				className
			)}
		>
			<div
				className='flex items-end justify-end h-56 w-full bg-cover bg-center'
				style={{
					backgroundImage: `url('${urlPic}')`,
				}}
			></div>
			<div className='p-3'>
				<h3 className='text-gray-700 uppercase'>{item.group_name}</h3>
			</div>
		</div>
	)
}

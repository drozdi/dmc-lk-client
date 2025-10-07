import { Button } from '@mantine/core'
import { useNavigate } from 'react-router'
import { useSidebar } from '../../components/context'
import { TemplateSlot } from '../../components/context/template'
import { cls } from '../../shared/utils'

export function Footer() {
	const navigate = useNavigate()
	const { isExpanded, isHovered, isMobile } = useSidebar()
	/*className={}*/
	return (
		<footer
			className={cls(
				'absolute transition-all duration-300 ease-in-out lg:fixed bottom-0 right-0 flex justify-between bg-white border-gray-200 z-40 dark:border-gray-800 dark:bg-gray-900 border-t p-3 gap-3',
				`${isMobile ? 'left-0' : isExpanded || isHovered ? 'lg:left-[290px]' : 'lg:left-[90px]'}`
			)}
		>
			<TemplateSlot name='footer'>
				<div></div>
			</TemplateSlot>
			<Button color='dark' size='sm' onClick={() => navigate(-1)}>
				Назад
			</Button>
		</footer>
	)
}

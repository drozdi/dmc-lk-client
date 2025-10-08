import { Button } from '@mantine/core'
import { useNavigate } from 'react-router'
import { TemplateSlot } from '../context/template'

export function Footer() {
	const navigate = useNavigate()
	/*className={}*/
	return (
		<footer>
			<TemplateSlot name='footer'>
				<div></div>
			</TemplateSlot>
			<Button color='dark' size='sm' onClick={() => navigate(-1)}>
				Назад
			</Button>
		</footer>
	)
}

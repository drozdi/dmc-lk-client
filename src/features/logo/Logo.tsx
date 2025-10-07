import { Box } from '@mantine/core'
import { useNavigate } from 'react-router-dom'

export function Logo({ className }: { className?: string }) {
	const navigate = useNavigate()
	return (
		<Box
			component='a'
			href='/'
			onClick={event => {
				event.preventDefault()
				navigate('/')
			}}
		>
			<img src='/assests/Logo_DMC_512.png' />
		</Box>
	)
}

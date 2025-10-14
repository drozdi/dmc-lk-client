import { Button, Group, LoadingOverlay, Paper, Text } from '@mantine/core'
import { useState } from 'react'
import { TbArrowsMaximize, TbArrowsMinimize } from 'react-icons/tb'

export function ExpandablePanel({
	title,
	loading = false,
	children,
	...otherProps
}: {
	title: string
	loading?: boolean
	children: React.ReactNode
}) {
	// Управляем состоянием компонента
	const [isExpanded, setIsExpanded] = useState(false)

	// Обработчик переключения состояния
	const toggleExpanded = () => {
		setIsExpanded(!isExpanded)
	}

	return (
		<Paper
			shadow='xl'
			p='md'
			{...otherProps}
			style={{
				// Стили меняются в зависимости от состояния
				position: isExpanded ? 'fixed' : 'relative',
				top: isExpanded ? 0 : 'auto',
				left: isExpanded ? 0 : 'auto',
				width: isExpanded ? '100vw' : '100%',
				height: isExpanded ? '100vh' : 'auto',
				zIndex: isExpanded ? 1000 : 1,
				overflow: 'auto',
			}}
		>
			<LoadingOverlay visible={loading} zIndex={1000} />
			{/* Шапка компонента */}
			<Group justify='space-between' mb='md'>
				<Text fw={500}>{title}</Text>
				<Button
					variant='subtle'
					size='sm'
					onClick={toggleExpanded}
					leftSection={isExpanded ? <TbArrowsMinimize size={16} /> : <TbArrowsMaximize size={16} />}
				>
					{isExpanded ? 'Свернуть' : 'Развернуть'}
				</Button>
			</Group>

			{/* Содержимое компонента */}
			<div>{children}</div>
		</Paper>
	)
}

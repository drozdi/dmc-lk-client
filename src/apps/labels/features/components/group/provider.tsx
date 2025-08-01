import { DragDropProvider } from '@dnd-kit/react'

export function GroupProvider({
	children,
	onDragEnd,
}: {
	children: React.ReactNode
	onDragEnd: (event: any) => void
}) {
	return <DragDropProvider onDragEnd={onDragEnd}>{children}</DragDropProvider>
}

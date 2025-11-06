import { useContext } from 'react'
import { createTemplateContext } from '../../shared/internal/utils'
import { Title } from '../../shared/ui'

export const [Template, useTemplateManager] = createTemplateContext()

Template.Title = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
	const manager = useContext(Template.Context)
	if (!manager) {
		return <Title {...props}>{children}</Title>
	}
	return <Template slot='title'>{children}</Template>
}

Template.Footer = ({ children }: { children: React.ReactNode }) => <Template slot='footer'>{children}</Template>

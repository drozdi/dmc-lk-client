import { useMemo } from 'react'
import { Icon } from '../ui/icon'
import { cls } from '../utils/'
import { render } from './render'

/**
 * Функция для преобразования строки в компонент Section
 *
 * @param {React.ReactElement} section - Секция
 * @returns {null | React.ReactElement} Преобразованная секция
 */
const processSection = (section?: React.ReactNode) => {
	return useMemo(() => {
		if (!section) {
			return null
		}
		return (
			<span className='dmc-section dmc-section--side'>
				{typeof section === 'string' ? <Icon>{section}</Icon> : section}
			</span>
		)
	}, [section])
}

/**
* Компонент для создания гибкой структуры с возможностью размещения элементов в колонки.

* @type {React.ForwardRefExoticComponent}
* @param {string|Function} [props.className] - классы
* @param {string|Function} [props.classBody] - классы для тела
* @param {React.ReactNode} [props.children] - дочерние элементы
* @param {React.ReactNode} [props.leftSection] - левый раздел
* @param {React.ReactNode} [props.rightSection] - правый раздел
* @param {object} props - свойства
* @returns {React.ReactElement} элемент Sections
*/
export function Sections({ className, classBody, children, leftSection, rightSection, ...props }: SectionsProps) {
	return render('div', {
		...props,
		className: cls('dmc-sections', className),
		children: (
			<>
				{processSection(leftSection)}
				{children && <span className={cls('dmc-section', classBody)}>{children}</span>}
				{processSection(rightSection)}
			</>
		),
	})
}

Sections.displayName = 'internal/Sections'

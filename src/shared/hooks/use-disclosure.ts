import { useCallback, useState } from 'react'

/**
 * Функция useDisclosure создает состояние и обработчики для управления открытием и закрытием компонента.
 * @param {boolean} [initial=false] - Начальное значение состояния.
 * @param {Object} [options] - Объект с опциями.
 * @param {Function} [options.onOpen] - Функция, которая будет вызвана при открытии компонента.
 * @param {Function} [options.onClose] - Функция, которая будет вызвана при закрытии компонента.
 * @returns {Array} - Массив, содержащий текущее значение состояния и объект с обработчиками для открытия, закрытия и переключения состояния.
 */
export function useDisclosure(
	initial: boolean = false,
	{
		onOpen,
		onClose,
	}: {
		onOpen?: (...args: any[]) => void
		onClose?: (...args: any[]) => void
	} = {}
): [
	boolean,
	{
		open: (...args: any[]) => void
		close: (...args: any[]) => void
		toggle: (...args: any[]) => void
	}
] {
	const [opened, setOpened] = useState<boolean>(initial)

	const open = useCallback(
		(...args: any[]) => {
			setOpened(isOpened => {
				if (!isOpened) {
					onOpen?.(...args)
					return true
				}
				return isOpened
			})
		},
		[onOpen]
	)

	const close = useCallback(
		(...args: any[]) => {
			setOpened(isOpened => {
				if (isOpened) {
					onClose?.(...args)
					return false
				}
				return isOpened
			})
		},
		[onClose]
	)

	const toggle = useCallback(
		(...args: any[]) => {
			opened ? close(...args) : open(...args)
		},
		[close, open, opened]
	)

	return [opened, { open, close, toggle }]
}

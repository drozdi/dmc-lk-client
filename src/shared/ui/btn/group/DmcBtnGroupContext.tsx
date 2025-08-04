import { createSafeContext } from '../../../internal/utils'

interface IBtnGroupContext {
	btnProps: Record<string, any>
	switchable: boolean
	selectable: boolean
	multiple: boolean
	value: any
	onChange: any
	isDisabled: (value: any) => boolean
	isActive: (value: any) => boolean
}

export const [DmcBtnGroupProvider, useDmcBtnGroupContext] =
	createSafeContext<IBtnGroupContext>()

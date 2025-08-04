import { useCallback, useMemo, useState } from 'react'
import * as TbIcons from 'react-icons/tb'
import { DmcIcon, DmcInput } from '../../../shared/ui'
import { debounce, hyphenate } from '../../../shared/utils'

const icons = Object.keys(TbIcons).map(item =>
	hyphenate(item).replace(/^-/, '')
)
export function IconPage() {
	const [list, setList] = useState<string[]>(icons)
	const [sear, setSear] = useState<string>('')
	const [filter, setFilter] = useState<string>(sear)

	const updateFilter = useCallback(
		debounce(value => {
			setFilter(value)
		}, 200),
		[]
	)
	const handleChange = useCallback(
		({ target }) => {
			setSear(target.value)
			updateFilter(target.value)
		},
		[updateFilter]
	)

	const calculeteList = useMemo<string[]>(() => {
		if (filter) {
			return icons.filter(item => item.includes(filter))
		} else {
			return icons
		}
	}, [list, filter])

	return (
		<>
			<DmcInput square underlined filled value={sear} onChange={handleChange} />
			<div className='grid grid-cols-7 gap-3 *:border *:border-color *:rounded'>
				{calculeteList.map(icon => (
					<div
						key={icon}
						className='text-cente flex flex-col justify-center items-center'
					>
						<DmcIcon size={100} title={icon}>
							{icon}
						</DmcIcon>
						<div className='border-t border-color w-full text-center p-2'>
							{icon}
						</div>
					</div>
				))}
			</div>
		</>
	)
}

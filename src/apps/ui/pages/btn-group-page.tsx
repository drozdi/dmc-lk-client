import { useMemo, useState } from 'react'
import { DmcBtn, DmcIcon } from '../../../shared/ui'
import { Form, useProps } from './utils'

export function BtnGroupPage() {
	const [val, setVal] = useState()
	const btnGroupExample = useProps(
		{
			grow: true,
			pills: false,
			vertical: false,
			multiple: false,
			selectable: false,
			switchable: false,
			separator: false,
			color: undefined,
			size: undefined,
			flat: false,
			outline: false,
			tonal: false,
			plain: false,
			text: false,
			square: false,
			rounded: false,
			round: false,
			disabled: false,
		},
		'DmcBtn.Group',
		'\n \
		<DmcBtn value={1}>btn1</DmcBtn>\n \
		<DmcBtn value={2}>btn2</DmcBtn>\n \
		<DmcBtn value={3}>btn3</DmcBtn>\n'
	)
	const btnGroupProps = useMemo(
		() => btnGroupExample.props,
		[btnGroupExample.props]
	)
	const btnGroupCode = useMemo(
		() => btnGroupExample.code,
		[btnGroupExample.code]
	)

	return (
		<div className='max-w-4xl m-auto flex flex-col gap-3'>
			<div className='p-4'>
				<DmcBtn.Group
					{...btnGroupProps}
					value={val}
					onChange={({ value }) => setVal(value)}
				>
					<DmcBtn value={1}>btn1</DmcBtn>
					<DmcBtn value={2}>btn2</DmcBtn>
					<DmcBtn value={3}>btn3</DmcBtn>
				</DmcBtn.Group>
				<br />
				<DmcBtn.Group
					{...btnGroupProps}
					value={val}
					onChange={({ value }) => setVal(value)}
				>
					<DmcBtn value={1}>
						<DmcIcon>mdi-close</DmcIcon>
					</DmcBtn>
					<DmcBtn value={2}>
						<DmcIcon>mdi-close</DmcIcon>
					</DmcBtn>
					<DmcBtn value={3}>
						<DmcIcon>mdi-close</DmcIcon>
					</DmcBtn>
				</DmcBtn.Group>
			</div>
			<div className='grid grid-cols-2 *:col-span-1 *:p-4 *:border *:border-separator'>
				<div>
					<pre className='bg-sky-500/50 text-white p-2 rounded-md mt-4 select-text'>
						{btnGroupCode}
					</pre>

					<pre className='bg-sky-500/50 text-white p-2 rounded-md mt-4 select-text'>
						{JSON.stringify(val)}
					</pre>
				</div>
				<div>
					{Form(
						{
							'DmcBtn.Group options': { type: 'header' },
							switchable: { type: 'checkbox' },
							selectable: { type: 'checkbox' },
							multiple: { type: 'checkbox' },

							separator: { type: 'checkbox' },
							vertical: { type: 'checkbox' },
							grow: { type: 'checkbox' },
							pills: { type: 'checkbox' },

							align: {
								type: 'select',
								values: ['start', 'center', 'between', 'end'],
							},

							'DmcBtn options': { type: 'header' },
							color: {
								type: 'select',
								values: [
									'primary',
									'secondary',
									'accent',
									'success',
									'warning',
									'info',
									'danger',
								],
							},
							size: {
								type: 'select',
								values: ['xs', 'sm', 'lg'],
							},
							flat: { type: 'checkbox' },
							outline: { type: 'checkbox' },
							tonal: { type: 'checkbox' },
							plain: { type: 'checkbox' },
							text: { type: 'checkbox' },
							block: { type: 'checkbox' },
							square: { type: 'checkbox' },
							rounded: { type: 'checkbox' },
							round: { type: 'checkbox' },
							disabled: { type: 'checkbox' },
							link: { type: 'checkbox' },
						},
						btnGroupExample
					)}
				</div>
			</div>
		</div>
	)
}

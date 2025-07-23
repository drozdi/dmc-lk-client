import { useState } from 'react'
import { Btn } from '../../../shared/ui'
import { Form, useProps } from './utils'

export function BtnPage() {
	const [label, setLabel] = useState('Example')
	const [disables, setDisables] = useState({
		default: false,
		primary: false,
		secondary: false,
		accent: false,
		success: false,
		warning: false,
		info: false,
		danger: false,
	})

	const btnExample = useProps(
		{
			color: '',
			size: '',
			flat: false,
			outline: false,
			tonal: false,
			text: false,
			plain: false,
			block: false,
			square: false,
			round: false,
			rounded: false,
			disabled: false,
			active: false,
			loading: false,
			leftSection: '',
			rightSection: '',
		},
		'Btn',
		label
	)

	return (
		<div className='max-w-4xl m-auto flex flex-col gap-3'>
			{true && (
				<table className='table-auto w-full border-collapse border-spacing-0 border border-color'>
					<thead>
						<tr className='*:text-center'>
							<td>color</td>
							<td>standart</td>
							<td>flat</td>
							<td>outline</td>
							<td>tonal</td>
							<td>plain</td>
							<td>text</td>
							<td>active</td>
						</tr>
					</thead>
					<tbody>
						{'default primary secondary accent success warning info danger'
							.split(/\s+/)
							.map(color => (
								<tr
									key={color}
									className='*:border *:border-color *:p-2 *:text-center'
								>
									<td>
										{color}
										<label className='block'>
											<input
												type='checkbox'
												name={color}
												checked={disables[color]}
												onChange={({ target }) =>
													setDisables(v => ({
														...v,
														[target.name]: !v[target.name],
													}))
												}
											/>
											<span className='ml-3 font-medium text-slate-500'>
												Disabled
											</span>
										</label>
									</td>
									<td>
										<Btn disabled={disables[color]} color={color}>
											Default
										</Btn>
									</td>
									<td>
										<Btn disabled={disables[color]} color={color} flat={true}>
											Flat
										</Btn>
									</td>
									<td>
										<Btn
											disabled={disables[color]}
											color={color}
											outline={true}
										>
											Outline
										</Btn>
									</td>
									<td>
										<Btn disabled={disables[color]} color={color} tonal={true}>
											Tonal
										</Btn>
									</td>
									<td>
										<Btn disabled={disables[color]} color={color} plain={true}>
											Plain
										</Btn>
									</td>
									<td>
										<Btn disabled={disables[color]} color={color} text={true}>
											Text
										</Btn>
									</td>
									<td>
										<Btn disabled={disables[color]} color={color} active={true}>
											Active
										</Btn>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			)}
			<h3>Generate</h3>
			<div className='grid grid-cols-2 *:col-span-1 *:p-4 *:border *:border-color'>
				<div>
					<Btn {...btnExample.props}>{label}</Btn>
					<pre className='bg-sky-500/50 text-white p-2 rounded-md mt-4 select-text'>
						{btnExample.code}
					</pre>
				</div>
				<div>
					<label className='block'>
						<span className='block font-medium text-slate-500'>label</span>
						<input
							className='bg-slate-200 border border-blue-900 p-2'
							type='text'
							value={label}
							onChange={({ target }) => setLabel(target.value)}
						/>
					</label>
					{Form(
						{
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
							leftSection: {
								type: 'checkbox',
								val: 'mdi-map-marker',
							},
							rightSection: {
								type: 'checkbox',
								val: 'mdi-close',
							},
							flat: { type: 'checkbox' },
							outline: { type: 'checkbox' },
							tonal: { type: 'checkbox' },
							plain: { type: 'checkbox' },
							loading: { type: 'checkbox' },
							text: { type: 'checkbox' },
							block: { type: 'checkbox' },
							square: { type: 'checkbox' },
							rounded: { type: 'checkbox' },
							round: { type: 'checkbox' },
							disabled: { type: 'checkbox' },
							active: { type: 'checkbox' },
						},
						btnExample
					)}
				</div>
			</div>
		</div>
	)
}

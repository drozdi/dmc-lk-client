import { useState } from 'react'
import { DmcInput } from '../../../shared/ui'
import { Form, useProps } from './utils'
export function InputPage() {
	const [danses, setDanses] = useState({
		default: false,
		primary: false,
		secondary: false,
		accent: false,
		success: false,
		warning: false,
		info: false,
		danger: false,
	})
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
	const inputExample = useProps(
		{
			label: 'Lable',
			labelColor: '',
			placeholder: 'Placeholder',
			color: '',
			outline: false,
			filled: true,
			square: false,
			underlined: false,
			dense: false,
			stackLabel: false,
			disabled: false,
			required: false,
			leftSection: '',
			rightSection: '',
			hint: 'Hint',
			errorMessage: '',
			lazyRules: true,
			hideHint: false,
			hideMessage: false,
			///???
			before: (
				<DmcIcon className='text-danger text-4xl'>mdi-home-account</DmcIcon>
			),
			after: <DmcIcon className='text-primary text-2xl'>mdi-close</DmcIcon>,
			rules: [
				v => (v && v.length > 2) || 'min 3 characters',
				v => (v && v.length < 7) || 'max 6 characters',
			], //*/
		},
		'Input'
	)
	return (
		<div className='max-w-4xl m-auto'>
			{true && (
				<table className='table-auto w-full border-collapse border-spacing-0 border border-separator'>
					<thead>
						<tr className='*:text-center'>
							<td className='w-32'>color</td>
							<td>standart</td>
							<td>filled</td>
							<td>outline</td>
							<td>underlined</td>
						</tr>
					</thead>
					<tbody>
						{'default primary secondary accent success warning info danger'
							.split(/\s+/)
							.map(color => (
								<tr key={color} className='*:border *:border-separator *:p-2'>
									<td>
										{color}
										<label className='block'>
											<input
												type='checkbox'
												name={color}
												checked={danses[color]}
												onChange={({ target }) =>
													setDanses(v => ({
														...v,
														[target.name]: !v[target.name],
													}))
												}
											/>
											<span className='ml-3 font-medium text-slate-500'>
												Dense
											</span>
										</label>
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
										<DmcInput
											color={color !== 'default' ? color : ''}
											dense={danses[color]}
											disabled={disables[color]}
											label='Label'
											placeholder='Placeholder'
										/>
									</td>
									<td>
										<DmcInput
											color={color !== 'default' ? color : ''}
											dense={danses[color]}
											disabled={disables[color]}
											filled={true}
											label='Label'
											placeholder='Placeholder'
										/>
									</td>
									<td>
										<DmcInput
											color={color !== 'default' ? color : ''}
											dense={danses[color]}
											disabled={disables[color]}
											outline={true}
											label='Label'
											placeholder='Placeholder'
										/>
									</td>

									<td>
										<DmcInput
											color={color !== 'default' ? color : ''}
											dense={danses[color]}
											disabled={disables[color]}
											underlined={true}
											label='Label'
											placeholder='Placeholder'
										/>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			)}
			{true && (
				<div className='grid grid-cols-2 *:col-span-1 *:p-4 *:border *:border-separator'>
					<div>
						<DmcInput {...inputExample.props} />
						<pre className='bg-sky-500/50 text-white p-2 rounded-md mt-4 select-text overflow-auto'>
							<code className='language-jsx'>{inputExample.code}</code>
						</pre>
					</div>
					<div>
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
								labelColor: {
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
								leftSection: {
									type: 'checkbox',
									val: 'mdi-account',
								},
								rightSection: {
									type: 'checkbox',
									val: 'mdi-close',
								},
								label: { type: 'text' },
								placeholder: { type: 'text' },
								hint: { type: 'text' },
								errorMessage: { type: 'text' },
								outline: { type: 'checkbox' },
								filled: { type: 'checkbox' },
								square: { type: 'checkbox' },
								underlined: { type: 'checkbox' },
								dense: { type: 'checkbox' },
								stackLabel: { type: 'checkbox' },
								required: { type: 'checkbox' },
								disabled: { type: 'checkbox' },
								hideMessage: { type: 'checkbox' },
								lazyRules: { type: 'checkbox' },
								hideHint: { type: 'checkbox' },
							},
							inputExample
						)}
					</div>
				</div>
			)}
		</div>
	)
}

import { capitalize } from '../../../../shared/utils'
function select(props) {
	return (
		<label key={props.name} className='block'>
			<span className='ml-3 font-medium text-slate-500'>
				{capitalize(props.name)}
			</span>
			<select
				className='block bg-slate-200 border border-blue-900 p-2'
				name={props.name}
				value={props.value}
				onChange={({ target }) => props.onChange(target.name, target.value)}
			>
				<option value=''>default</option>
				{props.values.map((color, index) => (
					<option key={index} value={color}>
						{color}
					</option>
				))}
			</select>
		</label>
	)
}
function checkbox(props) {
	return (
		<label key={props.name} className='block'>
			<input
				type='checkbox'
				name={props.name}
				checked={props.value}
				onChange={({ target }) => props.onChange(target.name)}
			/>
			<span className='ml-3 font-medium text-slate-500'>
				{capitalize(props.name)}
			</span>
		</label>
	)
}
function checkboxVal(props) {
	return (
		<label key={props.name} className='block'>
			<input
				type='checkbox'
				name={props.name}
				value={props.val}
				checked={props.value}
				onChange={({ target }) =>
					props.onChange(target.name, !props.value ? target.value : '')
				}
			/>
			<span className='ml-3 font-medium text-slate-500'>
				{capitalize(props.name)}
			</span>
		</label>
	)
}
function input(props) {
	return (
		<label key={props.name} className='block'>
			<span className='block font-medium text-slate-500'>
				{capitalize(props.name)}
			</span>
			<input
				className='bg-slate-200 border border-blue-900 p-2'
				type={props.type}
				name={props.name}
				value={props.value}
				onChange={({ target }) =>
					props.onChange(
						target.name,
						props.type === 'number' ? 1 * target.value : target.value
					)
				}
			/>
		</label>
	)
}

export function Form(conf = {}, { props, onText, onCheckbox, onSelect }) {
	return (
		<div>
			{Object.entries(conf).map(([name, p]) => {
				if (p.type === 'header') {
					return <h3 key={name}>{name}</h3>
				} else if (p.type === 'select') {
					return select({
						...p,
						name,
						value: props[name],
						onChange: onSelect,
					})
				} else if (p.type === 'checkbox') {
					if (p.val) {
						return checkboxVal({
							...p,
							name,
							value: props[name],
							onChange: onText,
						})
					}
					return checkbox({
						...p,
						name,
						value: props[name],
						onChange: onCheckbox,
					})
				} else if (p.type === 'number' || p.type === 'text') {
					return input({
						...p,
						name,
						value: props[name],
						onChange: onText,
					})
				}
			})}
		</div>
	)
}

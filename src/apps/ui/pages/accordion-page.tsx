import { useState } from 'react'
import { DmcAccordion } from '../../../shared/ui'
import { Form, useProps } from './utils'
export function AccordionPage() {
	const [val, setVal] = useState()
	//useEffect(() => console.log(val), [val]);
	const accordionExample = useProps(
		{
			border: false,
			filled: false,
			square: false,
			separated: false,
			multiple: false,
		},
		'DmcAccordion',
		`
	<DmcAccordion.Tab value="acc-1">
		<DmcAccordion.Header>Header I</DmcAccordion.Header>
		<DmcAccordion.Panel>
			sdghksdjf w ehrfwelfwe fklwef weer ter yeryer uy rt yuru ty uitur 54e t5 7y
		</DmcAccordion.Panel>
	</DmcAccordion.Tab>
	<DmcAccordion.Tab value="acc-2" disabled>
		<DmcAccordion.Header>Header II</DmcAccordion.Header>
		<DmcAccordion.Panel>
			sdghksdjf w ehrfwelfwe fklwef weer ter yeryer uy rt yuru ty uitur 54e t5 7y
		</DmcAccordion.Panel>
	</DmcAccordion.Tab>
	<DmcAccordion.Tab value="acc-3">
		<DmcAccordion.Header>Header III</DmcAccordion.Header>
		<DmcAccordion.Panel>
			sdghksdjf w ehrfwelfwe fklwef weer ter yeryer uy rt yuru ty uitur 54e t5 7y
		</DmcAccordion.Panel>
	</DmcAccordion.Tab>
`
	)
	return (
		<div className='max-w-4xl m-auto flex flex-col gap-3'>
			<DmcAccordion
				{...accordionExample.props}
				onChange={({ value }) => setVal(value)}
			>
				<DmcAccordion.Tab value='acc-1'>
					<DmcAccordion.Header>Header I</DmcAccordion.Header>
					<DmcAccordion.Panel>
						sdghksdjf w ehrfwelfwe fklwef weer ter yeryer uy rt yuru ty uitur
						54e t5 7y
					</DmcAccordion.Panel>
				</DmcAccordion.Tab>
				<DmcAccordion.Tab value='acc-2' disabled>
					<DmcAccordion.Header>Header II</DmcAccordion.Header>
					<DmcAccordion.Panel>
						sdghksdjf w ehrfwelfwe fklwef weer ter yeryer uy rt yuru ty uitur
						54e t5 7y
					</DmcAccordion.Panel>
				</DmcAccordion.Tab>
				<DmcAccordion.Tab value='acc-3'>
					<DmcAccordion.Header>Header III</DmcAccordion.Header>
					<DmcAccordion.Panel>
						sdghksdjf w ehrfwelfwe fklwef weer ter yeryer uy rt yuru ty uitur
						54e t5 7y
					</DmcAccordion.Panel>
				</DmcAccordion.Tab>
			</DmcAccordion>
			<div className='mt-8 grid grid-cols-2 *:col-span-1 *:p-4 *:border *:border-separator'>
				<div>
					<pre className='bg-sky-500/50 text-white p-2 rounded-md mt-4 select-text overflow-scroll'>
						{accordionExample.code}
					</pre>
					<pre className='bg-sky-500/50 text-white p-2 rounded-md mt-4 select-text'>
						{JSON.stringify(val)}
					</pre>
				</div>
				<div>
					{Form(
						{
							border: { type: 'checkbox' },
							filled: { type: 'checkbox' },
							square: { type: 'checkbox' },
							separated: { type: 'checkbox' },
							multiple: { type: 'checkbox' },
						},
						accordionExample
					)}
				</div>
			</div>
			<div className='mt-8 grid grid-cols-2 *:col-span-1 *:p-3 *:border *:border-separator'>
				<div>
					<pre className='bg-sky-500/50 text-white p-2 rounded-md mt-4 select-text overflow-scroll'>
						{`<DmcAccordion.Tab value="acc-1">
	<DmcAccordion.Header>Header I</DmcAccordion.Header>
	<DmcAccordion.Panel>
		sdghksdjf w ehrfwelfwe fklwef weer ter yeryer uy rt yuru ty uitur 54e t5 7y
	</DmcAccordion.Panel>
</DmcAccordion.Tab>`}
					</pre>
				</div>
				<div>
					<DmcAccordion.Tab value='acc-1'>
						<DmcAccordion.Header leftSection='mdi-close'>
							Header I
						</DmcAccordion.Header>
						<DmcAccordion.Panel>
							sdghksdjf w ehrfwelfwe fklwef weer ter yeryer uy rt yuru ty uitur
							54e t5 7y
						</DmcAccordion.Panel>
					</DmcAccordion.Tab>
				</div>
			</div>
		</div>
	)
}

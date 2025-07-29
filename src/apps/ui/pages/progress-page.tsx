import {
	DmcItem,
	DmcItemLabel,
	DmcItemSection,
	DmcList,
	DmcProgress,
	DmcProgressBar,
	DmcProgressCircle,
} from '../../../shared/ui'
import { Form, useProps } from './utils'
export function ProgressPage() {
	const progressExample = useProps(
		{
			type: 'bar',
			color: '',
			size: 128,
			thickness: 5,
			value: 33,
			buffer: 66,
			stripe: false,
			animation: false,
			indeterminate: false,
			reverse: false,
			label: false,
		},
		'DmcProgress'
	)
	return (
		<div className='max-w-4xl m-auto flex flex-col gap-3'>
			<h3>DmcProgressBar</h3>
			<DmcList dense>
				{[
					{
						elem: <DmcProgressBar value={33} className='h-2' />,
						code: '<DmcProgressBar value={33} className="h-2" />',
					},
					{
						elem: <DmcProgressBar value={33} buffer={66} className='h-2' />,
						code: '<DmcProgressBar value={33} buffer={66} className="h-2" />',
					},
					{
						elem: <DmcProgressBar indeterminate className='h-2' />,
						code: '<DmcProgressBar indeterminate className="h-2" />',
					},
					{
						elem: <DmcProgressBar stripe value={33} className='h-2' />,
						code: '<DmcProgressBar stripe value={33} className="h-2" />',
					},
					{
						elem: (
							<DmcProgressBar stripe animation value={33} className='h-2' />
						),
						code: '<DmcProgressBar stripe animation value={33} className="h-2" />',
					},
					{
						elem: <DmcProgressBar label value={33} className='h-6' />,
						code: '<DmcProgressBar label value={33} className="h-6" />',
					},
					{
						elem: (
							<DmcProgressBar value={33} className='h-6'>
								label
							</DmcProgressBar>
						),
						code: '<DmcProgressBar value={33} className="h-6">label</DmcProgressBar>',
					},
				].map((v, i) => (
					<DmcItem key={i} className='gap-2' vertical>
						<DmcItemSection>{v.elem}</DmcItemSection>
						<DmcItemSection className='bg-sky-500/50 text-white pl-2 rounded-md'>
							<DmcItemLabel>{v.code}</DmcItemLabel>
						</DmcItemSection>
					</DmcItem>
				))}
			</DmcList>
			<h3>DmcProgressCircle</h3>
			<DmcList dense>
				{[
					{
						elem: <DmcProgressCircle size={128} thickness={5} value={33} />,
						code: '<DmcProgressCircle size={128} thickness={5} value={33} />',
					},
					{
						elem: (
							<DmcProgressCircle
								size={128}
								thickness={5}
								value={33}
								buffer={66}
							/>
						),
						code: '<DmcProgressCircle size={128} thickness={5} value={33} buffer={66} />',
					},
					{
						elem: <DmcProgressCircle size={128} thickness={5} indeterminate />,
						code: '<DmcProgressCircle size={128} thickness={5} indeterminate />',
					},
					{
						elem: (
							<DmcProgressCircle
								size={128}
								thickness={5}
								color='gradient'
								indeterminate
							/>
						),
						code: '<DmcProgressCircle size={128} thickness={5} color="gradient" indeterminate />',
					},
					{
						elem: (
							<DmcProgressCircle size={128} thickness={5} label value={33} />
						),
						code: '<DmcProgressCircle size={128} thickness={5} label value={33} />',
					},
					{
						elem: (
							<DmcProgressCircle size={128} thickness={5} value={33}>
								label
							</DmcProgressCircle>
						),
						code: '<DmcProgressCircle size={128} thickness={5} value={33}>label</DmcProgressCircle>',
					},
				].map((v, i) => (
					<DmcItem key={i}>
						<DmcItemSection side>{v.elem}</DmcItemSection>
						<DmcItemSection className='bg-sky-500/50 text-white pl-2 rounded-md'>
							<DmcItemLabel>{v.code}</DmcItemLabel>
						</DmcItemSection>
					</DmcItem>
				))}
			</DmcList>
			<h3>Generate</h3>
			<div className='flex flex-col gap-4'>
				<DmcProgress {...progressExample.props}></DmcProgress>
				<div className='grid grid-cols-2 *:col-span-1 *:p-4 *:border *:border-separator'>
					<div>
						<pre className='bg-sky-500/50 text-white p-2 rounded-md mt-4 select-text'>
							{progressExample.code}
						</pre>
					</div>
					<div>
						{Form(
							{
								type: {
									type: 'select',
									values: ['bar', 'circle'],
								},
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
										'gradient',
									],
								},
								size: { type: 'number' },
								thickness: { type: 'number' },
								value: { type: 'number' },
								buffer: { type: 'number' },
								stripe: { type: 'checkbox' },
								animation: { type: 'checkbox' },
								indeterminate: { type: 'checkbox' },
								reverse: { type: 'checkbox' },
								label: { type: 'checkbox' },
							},
							progressExample
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

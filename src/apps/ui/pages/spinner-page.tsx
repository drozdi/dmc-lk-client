import {
	DmcItem,
	DmcItemLabel,
	DmcItemSection,
	DmcList,
	DmcSpinner,
	DmcSpinnerClock,
	DmcSpinnerComment,
	DmcSpinnerCube,
	DmcSpinnerGrid,
	DmcSpinnerHourglass,
	DmcSpinnerIos,
	DmcSpinnerOval,
	DmcSpinnerPie,
	DmcSpinnerRadio,
} from '../../../shared/ui'
import { Form, useProps } from './utils'
export function SpinnerPage() {
	const spinExample = useProps(
		{
			size: '1em',
			thickness: 5,
			color: '',
		},
		'DmcSpinner'
	)
	return (
		<div className='max-w-4xl m-auto flex flex-col gap-3'>
			<DmcList dense>
				{[
					{
						elem: <DmcSpinnerPie size='48px' />,
						code: '<DmcSpinnerPie size="48px" />',
					},
					{
						elem: <DmcSpinnerIos color='primary' size={48} />,
						code: '<DmcSpinnerIos color="primary" size={48} />',
					},
					{
						elem: <DmcSpinnerCube color='secondary' size='3rem' />,
						code: '<DmcSpinnerCube color="secondary" size="3rem" />',
					},
					{
						elem: <DmcSpinnerGrid color='accent' size='3em' />,
						code: '<DmcSpinnerGrid color="accent" size="3em" />',
					},
					{
						elem: <DmcSpinnerOval color='success' size='3em' />,
						code: '<DmcSpinnerOval color="success" size="3em" />',
					},
					{
						elem: <DmcSpinnerRadio color='danger' size='3em' />,
						code: '<DmcSpinnerRadio color="danger" size="3em" />',
					},
					{
						elem: <DmcSpinnerClock color='info' size='3em' />,
						code: '<DmcSpinnerClock color="info" size="3em" />',
					},
					{
						elem: <DmcSpinnerComment color='warning' size='3em' />,
						code: '<DmcSpinnerComment color="warning" size="3em" />',
					},
					{
						elem: <DmcSpinnerHourglass size='3em' />,
						code: '<DmcSpinnerHourglass size="3em" />',
					},
				].map((v, i) => (
					<DmcItem key={i}>
						<DmcItemSection side>{v.elem}</DmcItemSection>
						<DmcItemSection className='bg-sky-500/50 text-white pl-3 rounded-md'>
							<DmcItemLabel>{v.code}</DmcItemLabel>
						</DmcItemSection>
					</DmcItem>
				))}
			</DmcList>
			<h3>Generate</h3>
			<div className='grid grid-cols-2 *:col-span-1 *:p-4 *:border *:border-separator'>
				<div>
					<DmcSpinner {...spinExample.props} />
					<pre className='bg-sky-500/50 text-white p-2 rounded-md mt-4 select-text'>
						{spinExample.code}
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
									'danger',
									'info',
									'warning',
								],
							},
							size: { type: 'text' },
							thickness: { type: 'number' },
						},
						spinExample
					)}
				</div>
			</div>
		</div>
	)
}

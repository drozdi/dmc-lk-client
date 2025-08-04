import { DmcLink } from '../../../shared/ui'
const paths = [
	{
		path: 'btn',
		name: 'DmcBtn',
	},
	{
		path: 'btn-group',
		name: 'DmcBtnGroup',
	},
	{
		path: 'list',
		name: 'DmcList',
	},
	{
		path: 'icon',
		name: 'DmcIcon',
	},
	{
		path: 'link',
		name: 'DmcLink',
	},
	{
		path: 'input',
		name: 'DmcInput',
	},
	{
		path: 'tabs',
		name: 'DmcTabs',
	},
	{
		path: 'accordion',
		name: 'DmcAccordion',
	},
	{
		path: 'progress',
		name: 'DmcProgress',
	},
	{
		path: 'spinner',
		name: 'DmcSpinner',
	},
]
export function IndexPage() {
	return (
		<>
			{paths.map(item => (
				<DmcLink key={item.path} to={`/ui/${item.path}`} label={item.name} />
			))}
		</>
	)
}

import { Chevron, Icon, Link } from '../../../shared/ui'

export function LinkPage() {
	return (
		<div className='max-w-4xl m-auto flex flex-col gap-3'>
			<div className='grid grid-cols-2 gap-3'>
				<div>
					<Link
						to='#required-for-focus'
						label='With icon'
						leftSection='mdi-home'
					/>
					<Link
						href='#required-for-focus'
						label='With right section'
						leftSection='mdi-gauge'
						rightSection={<Chevron />}
					/>
					<Link
						href='#required-for-focus'
						label='Disabled'
						leftSection='mdi-circle-off-outline'
						disabled
					/>
					<Link
						href='#required-for-focus'
						label='With description'
						description='Additional information'
					/>
					<Link
						href='#required-for-focus'
						label='Active subtle'
						description='Additional information'
						leftSection='mdi-sine-wave'
						rightSection={<Chevron />}
					/>
					<Link
						href='#required-for-focus'
						label='Active light'
						leftSection='mdi-sine-wave'
						rightSection={<Chevron />}
						active
					/>
					<Link
						href='#required-for-focus'
						label='Active light'
						description='Additional information'
						leftSection='mdi-sine-wave'
						rightSection={<Chevron />}
						active
					/>
				</div>
				<pre className='bg-sky-500/50 text-white p-2 rounded-md mt-4 select-text'>
					<code className='language-jsx'>
						{`<Link
	href="#required-for-focus"
	label="With icon"
	leftSection="mdi-home" />
<Link
	href="#required-for-focus"
	label="With right section"
	leftSection={<Icon>mdi-gauge</Icon>}
	rightSection={<Chevron />}	/>
<Link
	href="#required-for-focus"
 	label="Disabled"
	leftSection="mdi-circle-off-outline"
	disabled />
<Link
	href="#required-for-focus"
	label="With description"
	description="Additional information" />
<Link
	href="#required-for-focus"
	label="Active subtle"
	description="Additional information"
	leftSection="mdi-sine-wave"
	rightSection={<Chevron />}	/>
<Link
	href="#required-for-focus"
	label="Active light"
	leftSection="mdi-sine-wave"
	rightSection={<Chevron />}
	active />
<Link
	href="#required-for-focus"
	label="Active light"
	description="Additional information"
	leftSection="mdi-sine-wave"
	rightSection={<Chevron />}
	active />`}
					</code>
				</pre>
			</div>
			<h3>Nested Link</h3>

			<div className='grid grid-cols-2 gap-3'>
				<div>
					<Link label='label' href='#1' leftSection='mdi-close'>
						<Link label='label' href='#1' leftSection='mdi-home'>
							<Link
								label='label'
								leftSection='mdi-home'
								description='description'
								href='#1'
							/>
							<Link label='label' description='description' href='#1' />
						</Link>
						<Link label='label' description='description' href='#1' active />
						<Link
							label='label'
							leftSection='mdi-home'
							description='description'
							href='#1'
							disabled
						/>
						<Link
							label='label'
							description='description'
							href='#1'
							leftSection={<Icon>mdi-close</Icon>}
							disabled
						>
							<Link label='label' description='description' href='#1' />
							<Link label='label' description='description' href='#1' />
							<Link label='label' description='description' href='#1' />
							<Link label='label' description='description' href='#1' />
						</Link>
					</Link>
					<Link label='label' href='#1' leftSection='mdi-close'>
						<Link label='label' href='#1' leftSection='mdi-home'>
							<Link
								label='label'
								leftSection='mdi-home'
								description='description'
								href='#1'
							/>
							<Link label='label' description='description' href='#1' />
						</Link>
						<Link label='label' description='description' href='#1' active />
						<Link
							label='label'
							leftSection='mdi-home'
							description='description'
							href='#1'
							disabled
						/>
						<Link
							label='label'
							description='description'
							href='#1'
							leftSection={<Icon>mdi-close</Icon>}
						>
							<Link label='label' description='description' href='#1' />
							<Link label='label' description='description' href='#1' />
							<Link label='label' description='description' href='#1' />
							<Link label='label' description='description' href='#1' />
						</Link>
					</Link>
				</div>
				<pre className='bg-sky-500/50 text-white p-2 rounded-md mt-4 select-text'>
					<code className='language-jsx'>
						{`<Link 
	label="label"
	href="#1"
	leftSection="mdi-close">
	<Link 
		label="label" 
		href="#1" 
		leftSection="mdi-home">
		<Link
			label="label"
			leftSection="mdi-home"
			description="description"
			href="#1" />
		<Link
			label="label"
			description="description"
			href="#1" />
	</Link>
	<Link
		label="label"
		description="description"
		href="#1"
		active />
	<Link
		label="label"
		leftSection="mdi-home"
		description="description"
		href="#1"
		disabled />
	<Link
		label="label"
		description="description"
		href="#1"
		leftSection={<Icon>mdi-close</Icon>}
		disabled>
			<Link
				label="label"
				description="description"
				href="#1" />
			<Link
				label="label"
				description="description"
				href="#1" />
			<Link
				label="label"
				description="description"
				href="#1" />
			<Link
				label="label"
				description="description"
				href="#1" />
	</Link>
</Link>
<Link 
	label="label"
	href="#1"
	leftSection="mdi-close">
	<Link 
		label="label" 
		href="#1" 
		leftSection="mdi-home">
		<Link
			label="label"
			leftSection="mdi-home"
			description="description"
			href="#1" />
		<Link
			label="label"
			description="description"
			href="#1" />
	</Link>
	<Link
		label="label"
		description="description"
		href="#1"
		active />
	<Link
		label="label"
		leftSection="mdi-home"
		description="description"
		href="#1"
		disabled />
	<Link
		label="label"
		description="description"
		href="#1"
		leftSection={<Icon>mdi-close</Icon>}>
			<Link
				label="label"
				description="description"
				href="#1" />
			<Link
				label="label"
				description="description"
				href="#1" />
			<Link
				label="label"
				description="description"
				href="#1" />
			<Link
				label="label"
				description="description"
				href="#1" />
	</Link>
</Link>`}
					</code>
				</pre>
			</div>
		</div>
	)
}

import { DmcChevron, DmcIcon, DmcLink } from '../../../shared/ui'

export function LinkPage() {
	return (
		<div className='max-w-4xl m-auto flex flex-col gap-3'>
			<div className='grid grid-cols-2 gap-3'>
				<div>
					<DmcLink
						to='#required-for-focus'
						label='With icon'
						leftSection='mdi-home'
					/>
					<DmcLink
						href='#required-for-focus'
						label='With right section'
						leftSection='mdi-gauge'
						rightSection={<DmcChevron />}
					/>
					<DmcLink
						href='#required-for-focus'
						label='Disabled'
						leftSection='mdi-circle-off-outline'
						disabled
					/>
					<DmcLink
						href='#required-for-focus'
						label='With description'
						description='Additional information'
					/>
					<DmcLink
						href='#required-for-focus'
						label='Active subtle'
						description='Additional information'
						leftSection='mdi-sine-wave'
						rightSection={<DmcChevron />}
					/>
					<DmcLink
						href='#required-for-focus'
						label='Active light'
						leftSection='mdi-sine-wave'
						rightSection={<DmcChevron />}
						active
					/>
					<DmcLink
						href='#required-for-focus'
						label='Active light'
						description='Additional information'
						leftSection='mdi-sine-wave'
						rightSection={<DmcChevron />}
						active
					/>
				</div>
				<pre className='bg-sky-500/50 text-white p-2 rounded-md mt-4 select-text'>
					<code className='language-jsx'>
						{`<DmcLink
	href="#required-for-focus"
	label="With icon"
	leftSection="mdi-home" />
<DmcLink
	href="#required-for-focus"
	label="With right section"
	leftSection={<DmcIcon>mdi-gauge</DmcIcon>}
	rightSection={<DmcChevron />}	/>
<DmcLink
	href="#required-for-focus"
 	label="Disabled"
	leftSection="mdi-circle-off-outline"
	disabled />
<DmcLink
	href="#required-for-focus"
	label="With description"
	description="Additional information" />
<DmcLink
	href="#required-for-focus"
	label="Active subtle"
	description="Additional information"
	leftSection="mdi-sine-wave"
	rightSection={<DmcChevron />}	/>
<DmcLink
	href="#required-for-focus"
	label="Active light"
	leftSection="mdi-sine-wave"
	rightSection={<DmcChevron />}
	active />
<DmcLink
	href="#required-for-focus"
	label="Active light"
	description="Additional information"
	leftSection="mdi-sine-wave"
	rightSection={<DmcChevron />}
	active />`}
					</code>
				</pre>
			</div>
			<h3>Nested Link</h3>

			<div className='grid grid-cols-2 gap-3'>
				<div>
					<DmcLink label='label' href='#1' leftSection='mdi-close'>
						<DmcLink label='label' href='#1' leftSection='mdi-home'>
							<DmcLink
								label='label'
								leftSection='mdi-home'
								description='description'
								href='#1'
							/>
							<DmcLink label='label' description='description' href='#1' />
						</DmcLink>
						<DmcLink label='label' description='description' href='#1' active />
						<DmcLink
							label='label'
							leftSection='mdi-home'
							description='description'
							href='#1'
							disabled
						/>
						<DmcLink
							label='label'
							description='description'
							href='#1'
							leftSection={<DmcIcon>mdi-close</DmcIcon>}
							disabled
						>
							<DmcLink label='label' description='description' href='#1' />
							<DmcLink label='label' description='description' href='#1' />
							<DmcLink label='label' description='description' href='#1' />
							<DmcLink label='label' description='description' href='#1' />
						</DmcLink>
					</DmcLink>
					<DmcLink label='label' href='#1' leftSection='mdi-close'>
						<DmcLink label='label' href='#1' leftSection='mdi-home'>
							<DmcLink
								label='label'
								leftSection='mdi-home'
								description='description'
								href='#1'
							/>
							<DmcLink label='label' description='description' href='#1' />
						</DmcLink>
						<DmcLink label='label' description='description' href='#1' active />
						<DmcLink
							label='label'
							leftSection='mdi-home'
							description='description'
							href='#1'
							disabled
						/>
						<DmcLink
							label='label'
							description='description'
							href='#1'
							leftSection={<DmcIcon>mdi-close</DmcIcon>}
						>
							<DmcLink label='label' description='description' href='#1' />
							<DmcLink label='label' description='description' href='#1' />
							<DmcLink label='label' description='description' href='#1' />
							<DmcLink label='label' description='description' href='#1' />
						</DmcLink>
					</DmcLink>
				</div>
				<pre className='bg-sky-500/50 text-white p-2 rounded-md mt-4 select-text'>
					<code className='language-jsx'>
						{`<DmcLink 
	label="label"
	href="#1"
	leftSection="mdi-close">
	<DmcLink 
		label="label" 
		href="#1" 
		leftSection="mdi-home">
		<DmcLink
			label="label"
			leftSection="mdi-home"
			description="description"
			href="#1" />
		<DmcLink
			label="label"
			description="description"
			href="#1" />
	</DmcLink>
	<DmcLink
		label="label"
		description="description"
		href="#1"
		active />
	<DmcLink
		label="label"
		leftSection="mdi-home"
		description="description"
		href="#1"
		disabled />
	<DmcLink
		label="label"
		description="description"
		href="#1"
		leftSection={<DmcIcon>mdi-close</DmcIcon>}
		disabled>
			<DmcLink
				label="label"
				description="description"
				href="#1" />
			<DmcLink
				label="label"
				description="description"
				href="#1" />
			<DmcLink
				label="label"
				description="description"
				href="#1" />
			<DmcLink
				label="label"
				description="description"
				href="#1" />
	</DmcLink>
</DmcLink>
<DmcLink 
	label="label"
	href="#1"
	leftSection="mdi-close">
	<DmcLink 
		label="label" 
		href="#1" 
		leftSection="mdi-home">
		<DmcLink
			label="label"
			leftSection="mdi-home"
			description="description"
			href="#1" />
		<DmcLink
			label="label"
			description="description"
			href="#1" />
	</DmcLink>
	<DmcLink
		label="label"
		description="description"
		href="#1"
		active />
	<DmcLink
		label="label"
		leftSection="mdi-home"
		description="description"
		href="#1"
		disabled />
	<DmcLink
		label="label"
		description="description"
		href="#1"
		leftSection={<DmcIcon>mdi-close</DmcIcon>}>
			<DmcLink
				label="label"
				description="description"
				href="#1" />
			<DmcLink
				label="label"
				description="description"
				href="#1" />
			<DmcLink
				label="label"
				description="description"
				href="#1" />
			<DmcLink
				label="label"
				description="description"
				href="#1" />
	</DmcLink>
</DmcLink>`}
					</code>
				</pre>
			</div>
		</div>
	)
}

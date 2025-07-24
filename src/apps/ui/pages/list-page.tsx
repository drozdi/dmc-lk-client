import {
	Icon,
	Item,
	ItemExpansion,
	ItemLabel,
	ItemSection,
	List,
} from '../../../shared/ui'

export function ListPage() {
	return (
		<div className='max-w-4xl m-auto'>
			<div className='w-64'>
				<List bordered>
					<ItemExpansion label='XItemExpansion 1'>
						<List>
							<ItemExpansion label='XItemExpansion 1.1'>
								<List>
									<ItemExpansion label='XItemExpansion 1.1.1'>
										<List>
											<ItemExpansion label='XItemExpansion 1.1.1.1'>
												ldlkdfhblkfdbfdkl ndbkldfnbklfdnb mdfnbdf,bnf
											</ItemExpansion>
											<ItemExpansion label='XItemExpansion 1.1.1.2'>
												ldlkdfhblkfdbfdkl ndbkldfnbklfdnb mdfnbdf,bnf
											</ItemExpansion>
										</List>
									</ItemExpansion>
									<ItemExpansion label='XItemExpansion 1.1.2'>
										ldlkdfhblkfdbfdkl ndbkldfnbklfdnb mdfnbdf,bnf
									</ItemExpansion>
								</List>
							</ItemExpansion>
							<ItemExpansion label='XItemExpansion 1.2'>
								ldlkdfhblkfdbfdkl ndbkldfnbklfdnb mdfnbdf,bnf
							</ItemExpansion>
						</List>
					</ItemExpansion>
					<ItemExpansion label='XItemExpansion 2'>
						ldlkdfhblkfdbfdkl ndbkldfnbklfdnb mdfnbdf,bnf
					</ItemExpansion>
					<ItemExpansion label='XItemExpansion 3'>
						ldlkdfhblkfdbfdkl ndbkldfnbklfdnb mdfnbdf,bnf
					</ItemExpansion>
					<Item as='label'>
						<ItemSection side>
							<input type='checkbox' value={1} disabled />
						</ItemSection>
						<ItemSection>
							<ItemLabel>Item 1</ItemLabel>
						</ItemSection>
					</Item>
					<Item as='label'>
						<ItemSection side>
							<input type='checkbox' value={2} />
						</ItemSection>
						<ItemSection>
							<ItemLabel>Item 2</ItemLabel>
						</ItemSection>
					</Item>
					<Item as='label'>
						<ItemSection side>
							<input type='checkbox' value={3} />
						</ItemSection>
						<ItemSection>
							<ItemLabel>Item 3</ItemLabel>
						</ItemSection>
					</Item>
					<Item>
						<ItemSection avatar>
							<Icon>home</Icon>
						</ItemSection>
						<ItemSection>
							<ItemLabel>Item 3</ItemLabel>
						</ItemSection>
						<ItemSection side>
							<Icon>home</Icon>
						</ItemSection>
						<ItemSection side>
							<Icon>mdi-close</Icon>
						</ItemSection>
					</Item>
					<Item to='/' target='_blank'>
						<ItemSection side>
							<Icon>home</Icon>
						</ItemSection>
						<ItemSection>
							<ItemLabel overline>Item 1</ItemLabel>
							<ItemLabel>label</ItemLabel>
							<ItemLabel caption>Description</ItemLabel>
						</ItemSection>
						<ItemSection side top>
							<Icon>x</Icon>
						</ItemSection>
					</Item>
					<Item to='https://ya.ru/' target='_blank' disabled>
						<ItemSection side>
							<Icon>home</Icon>
						</ItemSection>
						<ItemSection>Yandex</ItemSection>
					</Item>
					<Item disabled>
						<ItemSection>Item 3</ItemSection>
						<ItemSection side>
							<Icon>mdi-arrow-down</Icon>
						</ItemSection>
					</Item>
					<Item active>
						<ItemSection>Item 4</ItemSection>
					</Item>
				</List>
			</div>
		</div>
	)
}

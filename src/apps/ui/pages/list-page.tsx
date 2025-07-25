import {
	DmcIcon,
	DmcItem,
	DmcItemExpansion,
	DmcItemLabel,
	DmcItemSection,
	DmcList,
} from '../../../shared/ui'

export function ListPage() {
	return (
		<div className='max-w-4xl m-auto'>
			<div className='w-64'>
				<DmcList bordered>
					<DmcItemExpansion label='XItemExpansion 1'>
						<DmcList>
							<DmcItemExpansion label='XItemExpansion 1.1'>
								<DmcList>
									<DmcItemExpansion label='XItemExpansion 1.1.1'>
										<DmcList>
											<DmcItemExpansion label='XItemExpansion 1.1.1.1'>
												ldlkdfhblkfdbfdkl ndbkldfnbklfdnb mdfnbdf,bnf
											</DmcItemExpansion>
											<DmcItemExpansion label='XItemExpansion 1.1.1.2'>
												ldlkdfhblkfdbfdkl ndbkldfnbklfdnb mdfnbdf,bnf
											</DmcItemExpansion>
										</DmcList>
									</DmcItemExpansion>
									<DmcItemExpansion label='XItemExpansion 1.1.2'>
										ldlkdfhblkfdbfdkl ndbkldfnbklfdnb mdfnbdf,bnf
									</DmcItemExpansion>
								</DmcList>
							</DmcItemExpansion>
							<DmcItemExpansion label='XItemExpansion 1.2'>
								ldlkdfhblkfdbfdkl ndbkldfnbklfdnb mdfnbdf,bnf
							</DmcItemExpansion>
						</DmcList>
					</DmcItemExpansion>
					<DmcItemExpansion label='XItemExpansion 2'>
						ldlkdfhblkfdbfdkl ndbkldfnbklfdnb mdfnbdf,bnf
					</DmcItemExpansion>
					<DmcItemExpansion label='XItemExpansion 3'>
						ldlkdfhblkfdbfdkl ndbkldfnbklfdnb mdfnbdf,bnf
					</DmcItemExpansion>
					<DmcItem as='label'>
						<DmcItemSection side>
							<input type='checkbox' value={1} disabled />
						</DmcItemSection>
						<DmcItemSection>
							<DmcItemLabel>Item 1</DmcItemLabel>
						</DmcItemSection>
					</DmcItem>
					<DmcItem as='label'>
						<DmcItemSection side>
							<input type='checkbox' value={2} />
						</DmcItemSection>
						<DmcItemSection>
							<DmcItemLabel>Item 2</DmcItemLabel>
						</DmcItemSection>
					</DmcItem>
					<DmcItem as='label'>
						<DmcItemSection side>
							<input type='checkbox' value={3} />
						</DmcItemSection>
						<DmcItemSection>
							<DmcItemLabel>Item 3</DmcItemLabel>
						</DmcItemSection>
					</DmcItem>
					<DmcItem>
						<DmcItemSection avatar>
							<DmcIcon>home</DmcIcon>
						</DmcItemSection>
						<DmcItemSection>
							<DmcItemLabel>Item 3</DmcItemLabel>
						</DmcItemSection>
						<DmcItemSection side>
							<DmcIcon>home</DmcIcon>
						</DmcItemSection>
						<DmcItemSection side>
							<DmcIcon>mdi-close</DmcIcon>
						</DmcItemSection>
					</DmcItem>
					<DmcItem to='/' target='_blank'>
						<DmcItemSection side>
							<DmcIcon>home</DmcIcon>
						</DmcItemSection>
						<DmcItemSection>
							<DmcItemLabel overline>Item 1</DmcItemLabel>
							<DmcItemLabel>label</DmcItemLabel>
							<DmcItemLabel caption>Description</DmcItemLabel>
						</DmcItemSection>
						<DmcItemSection side top>
							<DmcIcon>x</DmcIcon>
						</DmcItemSection>
					</DmcItem>
					<DmcItem to='https://ya.ru/' target='_blank' disabled>
						<DmcItemSection side>
							<DmcIcon>home</DmcIcon>
						</DmcItemSection>
						<DmcItemSection>Yandex</DmcItemSection>
					</DmcItem>
					<DmcItem disabled>
						<DmcItemSection>Item 3</DmcItemSection>
						<DmcItemSection side>
							<DmcIcon>mdi-arrow-down</DmcIcon>
						</DmcItemSection>
					</DmcItem>
					<DmcItem active>
						<DmcItemSection>Item 4</DmcItemSection>
					</DmcItem>
				</DmcList>
			</div>
		</div>
	)
}

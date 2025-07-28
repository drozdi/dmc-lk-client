import { createSafeContext } from '../../internal/utils'

interface AccordionTabContext {}

export const [DmcAccordionTabProvider, useDmcAccordionTabContext] =
	createSafeContext<AccordionTabContext>(
		'DmcAccordion.Tab component was not found in the tree'
	)

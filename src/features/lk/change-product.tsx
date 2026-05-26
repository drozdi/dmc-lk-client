import { useStoreUserProfile } from "@/entites/auth";
import { useQueryProductions } from "@/entites/users";
import { Button, Checkbox, Group, Popover, Stack, Text } from '@mantine/core';
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { useShallow } from "zustand/shallow";

export const ChangeProduct = () => {
	const [opened, { close, open }] = useDisclosure(false);
	const qp = useQueryProductions()
	const { productions, setProductions } = useStoreUserProfile(useShallow(state => ({
		userInfo: state.userInfo,
		productions: state.productions,
		setProductions: state.setProductions,
	})));

	const handleChange = (value: string[]) => {
		if (value.length) {
			setValue(value);
		} else {
			setValue([String(qp.data?.[0]?.production_id)])
		}
	};
	const handleChangeAll = () => {
		if (qp.data?.length === productions.length) {
			setProductions([String(qp.data?.[0]?.production_id)])
		} else {
			setProductions(qp.data?.map(item => String(item.production_id)) || [])
		}
	}

	const [value, setValue] = useState(productions);
  const [debounced, setVal] = useDebouncedValue(value, 500);


	return <Popover opened={opened} offset={0}>
		<Popover.Target>
			<Button onMouseEnter={open} onMouseLeave={close}>
				ewrewrew
			</Button>
		</Popover.Target>
		<Popover.Dropdown onMouseEnter={open} onMouseLeave={close}>
			<Stack>
				<Checkbox.Card withBorder={false} onClick={handleChangeAll}>
					<Group wrap="nowrap" align="center">
						<Checkbox.Indicator checked={qp.data?.length === value.length} indeterminate={value.length !== qp.data?.length && !!value.length} />
						<Text>Все площадки</Text>
					</Group>
				</Checkbox.Card>
				<Checkbox.Group value={value} onChange={handleChange}>
					{qp.data?.map(item => 
						<Checkbox.Card withBorder={false} key={item.production_id} value={String(item.production_id)} ml='md'>
							<Group wrap="nowrap" align="center">
								<Checkbox.Indicator />
								<Text>{item.name_production}</Text>
							</Group>
						</Checkbox.Card>
					)}
			</Checkbox.Group>
			</Stack>
		</Popover.Dropdown>
	</Popover>
};

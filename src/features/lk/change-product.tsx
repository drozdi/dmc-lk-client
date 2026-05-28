import { useStoreUserProfile } from "@/entites/auth";
import { useQueryProductions } from "@/entites/users";
import { Loading } from "@/shared/ui";
import { Button, Checkbox, Group, Popover, ScrollArea, Stack, Text, type ScrollAreaProps } from '@mantine/core';
import { useDebouncedCallback, useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { TbSelector } from "react-icons/tb";

export const ChangeProduct = () => {
	const [opened, { close, open }] = useDisclosure(false);
	const { data, isLoading, findNameByIds } = useQueryProductions()
	const { productions, setProductions } = useStoreUserProfile();
	const [value, setValue] = useState((productions || []).map(String));
  const changeProductions = useDebouncedCallback((value) => {
		setProductions(value)
	}, 500);

	const handleChange = (value: string[]) => {
		if (value.length) {
			setValue(value);
		} else {
			setValue([String(data?.[0]?.production_id)])
		}
	};
	const handleChangeAll = () => {
		if (data?.length === value.length) {
			setValue([String(data?.[0]?.production_id)])
		} else {
			setValue(data?.map(item => String(item.production_id)) || [])
		}
	}

	useEffect(() => {
		changeProductions(value)
	}, [value])

	useEffect(() => {
		if (value?.length !== productions?.length) {
			setValue((productions || []).map(String));
		}
	}, [value, productions])

	return <Popover opened={opened} offset={0}>
		<Popover.Target>
			<Button onMouseEnter={open} onMouseLeave={close} radius="xs" variant="subtle" color="gray" rightSection={<TbSelector />} maw={256} >
				<Text style={{
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
					maxWidth: '100%'
				}}>{findNameByIds(productions)}</Text>
			</Button>
		</Popover.Target>
		<Popover.Dropdown onMouseEnter={open} onMouseLeave={close}>
			<Checkbox.Card withBorder={false} onClick={handleChangeAll}>
					<Group wrap="nowrap" align="center">
						<Checkbox.Indicator checked={data?.length === value.length} indeterminate={value.length !== data?.length && !!value.length} />
						<Text>Все площадки</Text>
					</Group>
				</Checkbox.Card>
			<Stack>
				<Loading<ScrollAreaProps> active={isLoading} h={250} maw={256} component={ScrollArea} offsetScrollbars scrollbars="y" keepMounted>
					<Checkbox.Group value={value} onChange={handleChange}>
						{data?.map(item => 
							<Checkbox.Card withBorder={false} key={item.production_id} value={String(item.production_id)} ml='md'>
								<Group wrap="nowrap" align="center">
									<Checkbox.Indicator />
									<Text>{item.name_production}</Text>
								</Group>
							</Checkbox.Card>
						)}
				</Checkbox.Group>
			</Loading>
			</Stack>
		</Popover.Dropdown>
	</Popover>
};

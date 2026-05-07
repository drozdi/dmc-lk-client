import { useStoreUserProfile } from "@/entites/auth";
import {
	GroupedContainer,
	GroupedItem,
	GroupedProvider,
	randomColorLabel,
	useGrouped,
	useProductionCount,
	useProductionFormatsCode,
	useProductionFormatsLabel,
	useStoreCountLabel,
	useStoreLabels
} from "@/entites/labels";
import { SelectProductions } from "@/entites/users";
import { notification } from "@/shared/notification";
import { Loading, Text } from "@/shared/ui";
import { labelName } from '@/shared/utils';
import {
	Center,
	Grid,
	Group,
	NumberFormatter,
	NumberInput,
	SimpleGrid,
	Stack
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { useEffect, useRef } from "react";
import { TbPlus, TbX } from "react-icons/tb";
import { LabelsGroupAdd } from "./lables-group-add";
import { Container } from "./ui/container";
import { Item } from "./ui/item";

export const LabelsGroup = () => {
	const inputRef = useRef<HTMLInputElement>(null);
	const production_id = Number(useStoreUserProfile(state => state.production_id)) || 0;
	const storeUserProfile = useStoreUserProfile();
	
	if (!production_id) {
		return (
			<>
				<Center mih="50vh">
					<Stack>
						<Text fz="h1" c="dimmed">
							Нужно выбрать площадку
						</Text>
						<SelectProductions
							excludeds={storeUserProfile.userInfo?.is_superuser ? [] : ["0"]}
							variant="underline"
							value={String(production_id)}
							onChange={(value) =>
								storeUserProfile.setProductionId(Number(value))
							}
						/>
					</Stack>
				</Center>
			</>
		);
	}


	const storeLabels = useStoreLabels();
	const containers = useGrouped(production_id);
	const formats = Object.keys(containers).filter((item) => item !== ".default");

	const codeFormat = useProductionFormatsCode(production_id);
	const labelFormat = useProductionFormatsLabel(production_id);
	

	const handleDeleteFormat = (format: ILabel["add_label_format"]) => {
		modals.openConfirmModal({
			title: `Вы уверены? Что хотитее удалить "${format}"`,
			labels: { confirm: "Удалить", cancel: "Нет" },
			onConfirm: async () => {
				if (
					await storeLabels.deleteFormat({
						format,
						production_id: production_id,
					})
				) {
					notification.success(`Группа "${format}" успешно удалена!`);
				}
			},
			confirmProps: {
				variant: "filled",
				color: "red",
			},
			cancelProps: {
				variant: "filled",
			},
		});
	};

	const handleRenameFormat = (format, newFormat) => {}

	const handleAddCount = (label_format: ILabel['statistics_print_format']) => {
		async function handleAdd() {
			const count_label = Number(inputRef.current?.value) || 0
			if (count_label > 0) {
				const res = await useStoreCountLabel.getState().addCount({
					place_name: "Пополнение этикеток",
					count_label: count_label,
					label_format,
					production_id,
				})
			}
			modals.closeAll();
		}

		const handleKeyPress = (e: any) => {
			if (e.key === "Enter") {
				handleAdd();
			}
		};

		modals.open({
			title: `Добавить этикеток "${labelName(label_format)}"`,
			children: <NumberInput ref={inputRef} min={0} defaultValue={0} placeholder="Количество" onKeyPress={handleKeyPress} onBlur={handleAdd} />,
			onEnterTransitionEnd: () => {
				inputRef.current?.focus();
			},
		})
		
	}

	useEffect(() => {
		storeLabels.load();
	}, []);

	
	const count = useProductionCount(production_id)
	

	return (
		<Loading active={storeLabels.isLoading} keepMounted>
			<LabelsGroupAdd mb='xs' />
						
			<GroupedProvider production_id={production_id}>
				<Grid gap='0'>
					<Grid.Col span={9} pr='xs' style={{
						borderRight: '2px solid var(--mantine-color-default-border)'
					}}>
						<SimpleGrid cols={3}>
						{formats.map((item) => (
							<GroupedContainer
								key={item}
								id={item}
								color={randomColorLabel(item)}
							>
								<Container label={`${item} (${codeFormat(item)})`} menu={[
									{ 
										children: 'Удалить', 
										onClick: () => handleDeleteFormat(item),
										rightSection: <TbX />,
									},
									{ 
										children: 'Дабавить количество', 
										onClick: () => handleAddCount(codeFormat(item)),
										rightSection: <TbPlus />,
									},
								]} title={<Group justify="space-between">
									<div>
										<Text>
											Количество:
										</Text>
										<NumberFormatter value={count.distributed.find((count) => count.add_label_format === item)?.sum} />
									</div>
									<div>
										<Text>
											Метраж:
										</Text>
										<NumberFormatter value={count.distributed.find((count) => count.add_label_format === item)?.sum_consumption} />
									</div>
								</Group>}> 
									{(containers[item] || []).map((label) => (
										<GroupedItem key={label.id} id={label.id}>
											<Item>{label.id}</Item>
										</GroupedItem>
									))}
								</Container>
							</GroupedContainer>
						))}
						</SimpleGrid>
					</Grid.Col>
				
					<Grid.Col span={3} pl='xs'>
						<GroupedContainer id=".default">
							<Container label={labelFormat('.default')}>
								{(containers[".default"] || []).map((item) => (
									<GroupedItem key={item.id} id={item.id}>
										<Item 
											cnt={count.not_distributed.find((count) => count.add_label_format === item.id)?.sum || '-'} 
											len={count.not_distributed.find((count) => count.add_label_format === item.id)?.sum_consumption || '-'}
										>{item.id}</Item>
									</GroupedItem>
								))}
							</Container>
						</GroupedContainer>
					</Grid.Col>
				</Grid>
			</GroupedProvider>
		</Loading>
	);
};

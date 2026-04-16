import { useStoreUserProfile } from "@/entites/auth";
import {
	GroupedContainer,
	GroupedItem,
	GroupedProvider,
	randomColorLabel,
	useGrouped,
	useStoreLabels,
} from "@/entites/labels";
import { SelectProductions } from "@/entites/users";
import { notification } from "@/shared/notification";
import { LabelFormat, Loading } from "@/shared/ui";
import {
	ActionIcon,
	Center,
	Flex,
	Stack,
	Table,
	Text,
	TextInput,
	Tooltip,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { TbList, TbPlus, TbX } from "react-icons/tb";

export const LabelsGroup = () => {
	const storeLabels = useStoreLabels();
	const storeUserProfile = useStoreUserProfile();
	const containers = useGrouped(storeUserProfile.production_id);
	const [newFormat, setNewFormat] = useState<string>("");
	const [error, setError] = useState<string>("");

	const formats = Object.keys(containers).filter((item) => item !== ".default");

	useEffect(() => {
		storeLabels.load();
	}, []);

	if (
		!storeUserProfile.production_id ||
		storeUserProfile.production_id == "0"
	) {
		return (
			<>
				<Center mih="50vh">
					<Stack>
						<Text fz="h1" c="dimmed">
							Нужно выбрать площадку
						</Text>
						<SelectProductions
							excludeds={storeUserProfile.userData?.is_superuser ? [] : ["0"]}
							variant="underline"
							value={String(storeUserProfile.production_id)}
							onChange={(value) =>
								storeUserProfile.setProductionId(Number(value))
							}
						/>
					</Stack>
				</Center>
			</>
		);
	}

	const handleChange = ({ target }: React.ChangeEvent) => {
		setNewFormat(target.value);
		setError("");
	};

	const handleKeyPress = async ({ key }: React.KeyboardEvent) => {
		if (key === "Enter") {
			await handleAddFormat();
		}
	};

	const handleAddFormat = async () => {
		if (newFormat.trim()) {
			const res = await storeLabels.addFormat({
				format: newFormat.trim(),
				production_id: storeUserProfile.production_id,
			});
			if (res) {
				notification.success(
					`Группа "${res.add_label_format}" успешно добавлена!`,
				);
			}
			setNewFormat("");
		} else {
			setError("Введите название!");
		}
	};

	const handleDeleteFormat = (format: ILabel["add_label_format"]) => {
		modals.openConfirmModal({
			title: `Вы уверены? Что хотитее удалить "${format}"`,
			labels: { confirm: "Удалить картинку", cancel: "Нет" },
			onConfirm: async () => {
				if (
					await storeLabels.deleteFormat({
						format,
						production_id: storeUserProfile.production_id,
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

	return (
		<Stack gap="xs">
			<Loading active={storeLabels.isLoading} keepMounted>
				<TextInput
					w="100%"
					placeholder="Добавить формат"
					error={error}
					disabled={storeLabels.isLoading}
					value={newFormat}
					onChange={handleChange}
					onKeyDown={handleKeyPress}
					rightSection={
						<Tooltip
							label={`Добавить группу! Можно нажать и на Enter после ввода!`}
						>
							<ActionIcon disabled={Boolean(error)} onClick={handleAddFormat}>
								<TbPlus />
							</ActionIcon>
						</Tooltip>
					}
				/>
				<GroupedProvider production_id={storeUserProfile.production_id}>
					<Flex mt="xs">
						<Stack
							style={{
								width: "50%",
							}}
						>
							{formats.map((item) => (
								<GroupedContainer
									key={item}
									column={item}
									color={randomColorLabel(item)}
								>
									<Table striped={false}>
										<Table.Thead>
											<Table.Tr>
												<Table.Td w="2rem"></Table.Td>
												<Table.Td>
													<LabelFormat>{item}</LabelFormat>
												</Table.Td>
												<Table.Td align="right">
													<Tooltip label={`Удалить "${item}"`}>
														<ActionIcon
															disabled={storeLabels.isLoading}
															color="red"
															onClick={() => handleDeleteFormat(item)}
														>
															<TbX />
														</ActionIcon>
													</Tooltip>
												</Table.Td>
											</Table.Tr>
										</Table.Thead>
										<Table.Tbody>
											{(containers[item] || []).map((item) => (
												<GroupedItem key={item.id} id={item.id} data={item}>
													<Table.Tr>
														<Table.Td ta="center">
															<TbList />
														</Table.Td>
														<Table.Td colSpan={2}>
															<LabelFormat>{item.id}</LabelFormat>
														</Table.Td>
													</Table.Tr>
												</GroupedItem>
											))}
										</Table.Tbody>
									</Table>
								</GroupedContainer>
							))}
						</Stack>
						<GroupedContainer
							column=".default"
							color={randomColorLabel(".default")}
						>
							<Table
								striped={false}
								style={{
									width: "50%",
								}}
							>
								<Table.Thead>
									<Table.Tr>
										<Table.Td w="2rem"></Table.Td>
										<Table.Td>Без группы</Table.Td>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{(containers[".default"] || []).map((item) => (
										<GroupedItem key={item.id} id={item.id} data={item}>
											<Table.Tr>
												<Table.Td ta="center">
													<TbList />
												</Table.Td>
												<Table.Td>
													<LabelFormat>{item.id}</LabelFormat>
												</Table.Td>
											</Table.Tr>
										</GroupedItem>
									))}
								</Table.Tbody>
							</Table>
						</GroupedContainer>
					</Flex>
				</GroupedProvider>
			</Loading>
		</Stack>
	);
};

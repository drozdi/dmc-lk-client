import {
	SelectActions,
	SelectAnalyticsFields,
	useQueryAnalyticsFields,
	useStoreElastic,
} from "@/entites/analytics";
import { ButtonRemove } from "@/shared/ui";
import {
	Flex,
	Popover,
	Stack,
	TagsInput,
	Text,
	TextInput,
	type SelectProps,
} from "@mantine/core";
import { useDisclosure, useElementSize } from "@mantine/hooks";
import { useShallow } from "zustand/shallow";

interface ElasticFilterProps extends SelectProps {}

export const ElasticFilter = (props: ElasticFilterProps) => {
	const [opened, { open, close }] = useDisclosure(false);
	const { ref, width } = useElementSize();

	const { findLabelByCode, findActionByCode } = useQueryAnalyticsFields();

	const { template, save } = useStoreElastic(
		useShallow((state) => ({
			template: state.template,
			save: state.save,
		})),
	);

	const update = () => save({ ...template });

	const handleAddWhere = (
		name_field_table: string,
		sing_action: PermittedActions = "=",
		search_value: undefined | string | string[] = undefined,
		single_action_list: SingleActionList = "and",
	) => {
		template.company.list_where.push({
			name_field_table,
			sing_action,
			search_value,
			single_action_list,
		});
		console.log(template.company.list_where);
		update();
	};
	const handleDelWhere = (index: number) => {
		template.company.list_where = template.company.list_where?.filter(
			(_, i) => i !== index,
		);
		update();
	};

	const handleUpdateWhereSingAction = (
		index: number,
		sing_action: PermittedActions = "=",
	) => {
		if (template.company.list_where[index]) {
			template.company.list_where[index].sing_action = sing_action;
		}
		update();
	};
	const handleUpdateWhereSearchValue = (
		index: number,
		search_value: undefined | string | string[],
	) => {
		if (template.company.list_where[index]) {
			template.company.list_where[index].search_value = search_value;
		}
		update();
	};
	const handleUpdateWhereSingleActionList = (
		index: number,
		single_action_list: SingleActionList,
	) => {
		if (template.company.list_where[index]) {
			template.company.list_where[index].single_action_list =
				single_action_list;
		}
		update();
	};

	return (
		<>
			<Popover
				opened={opened && (template.company.list_where || []).length}
				position="bottom-end"
				width={width}
				offset={0}
			>
				<Popover.Target ref={ref}>
					<SelectAnalyticsFields
						{...props}
						onMouseEnter={open}
						onMouseLeave={close}
						onDropdownOpen={close}
						value={""}
						onChange={(value) => {
							open();
							handleAddWhere(value as string);
						}}
						placeholder="Добавить поиск"
					/>
				</Popover.Target>
				<Popover.Dropdown onMouseEnter={open} onMouseLeave={close}>
					<Stack>
						{(template.company.list_where || []).map((item, index) => (
							<Flex
								key={index}
								direction="row"
								justify="space-between"
								align="self-start"
							>
								<Text w={150}>{findLabelByCode(item.name_field_table)}</Text>
								<SelectActions
									flex="1"
									value={item.sing_action || "="}
									includes={findActionByCode(item.name_field_table)}
									onChange={(sing_action) =>
										handleUpdateWhereSingAction(
											index,
											sing_action as PermittedActions,
										)
									}
								/>

								{item.sing_action === "in" || item.sing_action === "not_in" ? (
									<TagsInput
										flex="1"
										value={[].concat(item.search_value as string[])}
										onChange={(value) =>
											handleUpdateWhereSearchValue(index, value)
										}
										placeholder="Enter поиск"
									/>
								) : (
									<TextInput
										flex="1"
										value={item.search_value as string[]}
										onChange={({ target }) =>
											handleUpdateWhereSearchValue(index, target.value)
										} ///
									/>
								)}
								{/* <SelectSingleAction
								flex="0"
								value={item.single_action_list || "and"}
								onChange={(single_action_list) =>
									handleUpdateWhereSingleActionList(
										index,
										single_action_list as SingleActionList,
									)
								}
							/> */}
								<ButtonRemove flex="0" onClick={() => handleDelWhere(index)} />
							</Flex>
						))}
					</Stack>
				</Popover.Dropdown>
			</Popover>
		</>
	);
};

import { useStoreUserProfile } from "@/entites/auth";
import { useStoreLabels } from "@/entites/labels";
import { notification } from "@/shared/notification";
import { ButtonIcon } from "@/shared/ui";
import {
	Button,
	Modal,
	Notification,
	NumberInput,
	TextInput
} from "@mantine/core";
import { isInRange, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { TbPlus } from "react-icons/tb";

export const LabelsGroupAdd = () => {
	const production_id = Number(useStoreUserProfile(state => state.production_id)) || 0
	if (!production_id) {
		return null
	}
	const storeLabels = useStoreLabels();
	const [error, setError] = useState<string>("");
	const [opened, { open, close }] = useDisclosure(false)
	
	const form = useForm({
		clearInputErrorOnChange: true,
		initialValues: {
			width: 0,
			height: 0,
			gap: 0,
			format: ''
		},
		validate: {
			width: isInRange({ min: 1} , 'Введите значение больше 0'),
			height: isInRange({ min: 1} , 'Введите значение больше 0'),
			gap: isInRange({ min: 0} , 'Введите значение больше 0'),
			format: (value) => {
				storeLabels.formats.find((format) => {
				})
			}
		},
		transformValues: (values) => {
			return {
				...values,
				print: `W${values.width}H${values.height}G${values.gap}`
			}
		}
	})

	form.watch('width', ({value}) => {
		form.setFieldValue('format', `W${value}H${form.values.height}G${form.values.gap}`)
	})
	form.watch('height', ({value}) => {
		form.setFieldValue('format', `W${form.values.width}H${value}G${form.values.gap}`)
	})
	form.watch('gap', ({value}) => {
		form.setFieldValue('format', `W${form.values.width}H${form.values.height}G${value}`)
	})






	const handleAddFormat = async (fields) => {
		console.log(fields)
		return
		if (newFormat.trim()) {
			const res = await storeLabels.addFormat({
				format: newFormat.trim(),
				production_id,
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

	return (
		<>
				<Button onClick={open} rightSection={<TbPlus />}>
					Добавить группу
				</Button>
				<Modal opened={opened} onClose={close} title="Добавление группы">
					{error && <Notification color="red" withCloseButton={false}>
						{error}
					</Notification>}
					<NumberInput label='Ширина' placeholder='Ширина' {...form.getInputProps('width')} />
					<NumberInput label='Длина' placeholder='Длина' {...form.getInputProps('height')} />
					<NumberInput label='Зазор' placeholder='Зазор' {...form.getInputProps('gap')} />
					<TextInput
						label='Формат'
						placeholder="Формат"
						{...form.getInputProps('format')}
						rightSection={
							<ButtonIcon loading={storeLabels.isLoading} tooltip={`Добавить группу! Можно нажать и на Enter после ввода!`}  onClick={form.onSubmit(handleAddFormat)}>
								<TbPlus />
							</ButtonIcon>
						}
					/>
				</Modal>
		</>
	);
};

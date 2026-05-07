import { useStoreUserProfile } from "@/entites/auth";
import { useStoreLabels } from "@/entites/labels";
import {
	Button,
	Group,
	Modal,
	Notification,
	NumberInput,
	TextInput,
	type ButtonProps
} from "@mantine/core";
import { isInRange, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { TbPlus } from "react-icons/tb";

export interface LabelsGroupAddProps extends ButtonProps {

}

interface Values {
	width: number,
	height: number,
	gap: number,
	format: string
	print: string
}

export const LabelsGroupAdd = (props: LabelsGroupAddProps) => {
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
			format: 'W0H0G0',
			print: 'W0H0G0',
		},
		validate: (values: Values) => {
			let width = isInRange({ min: 0} , 'Введите значение больше 0')(values.width)
			let height = isInRange({ min: 0} , 'Введите значение больше 0')(values.height)
			let gap = isInRange({ min: 0} , 'Введите значение больше 0')(values.gap)
			let format = values.format? (storeLabels.formats[production_id] || []).find((format) => format.add_label_format === values.format)? 'Группа уже существует': null: 'Название формата должно быть заполнено'
			if (width || height || gap || format) {
				return  {width, height, gap, format }
			}
			const print = !!(storeLabels.formats[production_id] || []).find((format) => format.statistics_print_format === values.print)
			if (print) {
				return {
					width: 'Этикетка с такими значениями уже есть', 
					height: 'Этикетка с такими значениями уже есть', 
					gap: 'Этикетка с такими значениями уже есть', 
				}	
			}
			return {}
		},
	})
	function format (width = form.values.width, height = form.values.height, gap = form.values.gap) {
		const format = form.values.format;
		if (!format || /W[0-9]+(?:\.[0-9]*)?H[0-9]+(?:\.[0-9]*)?G[0-9]+(?:\.[0-9]*)?/i.test(format)) {
			form.setFieldValue('format', `W${width}H${height}G${gap}`)
		}
		form.setFieldValue('print', `W${width}H${height}G${gap}`)
	}
	form.watch('width', ({value}) => {
		format(value)
	})
	form.watch('height', ({value}) => {
		format(undefined, value)
	})
	form.watch('gap', ({value}) => {
		format(undefined, undefined, value)
	})

	const handleAddFormat = async (fields: Values) => {
		const res = await storeLabels.addFormat({
			format: fields.format,
			print: fields.print,
			production_id,
		});
		if (res) {
			form.setValues({
				width: 0, height: 0, gap: 0,
				format: 'W0H0G0', print: 'W0H0G0'
			})
			close()
		}
	};

	return (
		<>
				<Button {...props} onClick={open} rightSection={<TbPlus />}>
					Добавить группу
				</Button>
				<Modal opened={opened} onClose={close} title="Добавление группы">
					{error && <Notification color="red" withCloseButton={false}>
						{error}
					</Notification>}
					<NumberInput label='Ширина' placeholder='Ширина' min={0} step={0.1} {...form.getInputProps('width')} />
					<NumberInput label='Длина' placeholder='Длина' min={0} step={0.1} {...form.getInputProps('height')} />
					<NumberInput label='Зазор' placeholder='Зазор' min={0} step={0.1} {...form.getInputProps('gap')} />
					<TextInput
						label='Формат'
						placeholder="Формат"
						{...form.getInputProps('format')}
					/>
					<Group mt='xs' justify="flex-end">
						<Button rightSection={<TbPlus />} loading={storeLabels.isLoading} onClick={() => form.onSubmit(handleAddFormat)()}>
								Доьавить
						</Button>
					</Group>
				</Modal>
		</>
	);
};

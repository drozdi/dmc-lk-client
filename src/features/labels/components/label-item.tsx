import { useStoreCountLabel } from '@/entites/labels'
import { ButtonIcon, Item, ItemSection } from '@/shared/ui'
import { NumberInput } from '@mantine/core'
import { forwardRef, useRef, useState } from 'react'
import { TbList } from 'react-icons/tb'

interface LabelItemProps {
	groupable?: boolean
	editable?: boolean
	bg?: string
	item: {
		add_label_format: string
		sum: number
		production_id: number
	}
	warningLimits?: number
	dangerLimits?: number
	warningColor?: string
	dangerColor?: string
}

export const LabelItem = forwardRef(
	(
		{
			item,
			dangerLimits = 0,
			warningLimits = -50,
			warningColor = 'red',
			dangerColor = 'orange',
			groupable,
			editable,
			bg,
			...props
		}: LabelItemProps,
		ref
	) => {

		const storeCountLabel = useStoreCountLabel();
		const inputRef = useRef<HTMLElement>(null)
		const [editMode, setEditMode] = useState<boolean>(false)
		const handleSave = async () => {
			if (inputRef.current?.value) {
				await storeCountLabel.addCount({
					count_label: Number(inputRef.current?.value),
					place_name: 'Пополнение этикеток',
					label_format: item.add_label_format,
					production_id: item.production_id,
				})
			}
			setEditMode(false)
		}
		const handleKeyPress = (e: any) => {
			if (e.key === 'Enter') {
				handleSave()
			}
		}
		return (
			<Item
				component='div'
				{...props}
				bg={bg ? bg : item.sum < dangerLimits ? (item.sum < warningLimits ? warningColor : dangerColor) : ''}
				ref={ref}
				style={{
					...(groupable ? { cursor: 'move' } : {}),
				}}
			>
				{groupable && (
					<ItemSection side>
						<TbList />
					</ItemSection>
				)}
				<ItemSection>{item.add_label_format}</ItemSection>
				{editable && editMode && (
					<ItemSection>
						<NumberInput
							ref={inputRef}
							w='100%'
							color='info'
							autoFocus
							onKeyPress={handleKeyPress}
							onBlur={() => handleSave()}
						/>
					</ItemSection>
				)}

				<ItemSection side>{item.sum}</ItemSection>
				{editable && (
					<ItemSection side>
						<ButtonIcon loading={storeCountLabel.isLoading} onClick={() => setEditMode(true)}>
							tb-circle-plus
						</ButtonIcon>
					</ItemSection>
				)}
			</Item>
		)
	}
)

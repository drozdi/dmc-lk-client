import { TextInput } from '@mantine/core'
import { forwardRef, useRef, useState } from 'react'
import { TbList } from 'react-icons/tb'
import { useQuery } from '../../../../../shared/hooks'
import { ButtonIcon, DmcItem, DmcItemSection } from '../../../../../shared/ui'
import { requestLabelsCountAdd } from '../../../api'

export const ReportItem = forwardRef(
	(
		{
			item,
			warningLimits,
			dangerLimits,
			onUpdate,
			groupable,
			...props
		}: {
			groupable?: boolean
			item: {
				add_label_format: string
				sum: number
				production_id: number
			}
			warningLimits: number
			dangerLimits: number
			onUpdate?: (res: any) => void
		},
		ref
	) => {
		const { request, isLoading } = useQuery(requestLabelsCountAdd)
		const inputRef = useRef()
		const [editMode, setEditMode] = useState<boolean>(false)
		const handleSave = async () => {
			if (inputRef.current.value) {
				const res = await request({
					count_label: inputRef.current?.value,
					place_name: 'Пополнение этикеток',
					label_format: item.add_label_format,
					production_id: item.production_id,
				})
				onUpdate?.(res.data)
			}
			setEditMode(false)
		}
		const handleKeyPress = (e: any) => {
			if (e.key === 'Enter') {
				handleSave()
			}
		}
		return (
			<DmcItem
				component='div'
				{...props}
				color={item.sum < dangerLimits ? (item.sum < warningLimits ? 'warning' : 'danger') : ''}
				ref={ref}
			>
				{groupable && (
					<DmcItemSection side>
						<TbList />
					</DmcItemSection>
				)}
				<DmcItemSection>{item.add_label_format}</DmcItemSection>
				{editMode && (
					<DmcItemSection>
						<TextInput
							ref={inputRef}
							type='number'
							w='100%'
							color='info'
							autoFocus
							onKeyPress={handleKeyPress}
							onBlur={() => handleSave()}
						/>
					</DmcItemSection>
				)}

				<DmcItemSection side>{item.sum}</DmcItemSection>
				<DmcItemSection side>
					<ButtonIcon loading={isLoading} onClick={() => setEditMode(true)}>
						tb-circle-plus
					</ButtonIcon>
				</DmcItemSection>
			</DmcItem>
		)
	}
)

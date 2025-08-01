import { forwardRef, useRef, useState } from 'react'
import { TbCirclePlus, TbList } from 'react-icons/tb'
import { useQuery } from '../../../../../shared/hooks'
import {
	DmcBtn,
	DmcInput,
	DmcItem,
	DmcItemSection,
} from '../../../../../shared/ui'
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
				{...props}
				color={
					item.sum < dangerLimits
						? item.sum < warningLimits
							? 'warning'
							: 'danger'
						: ''
				}
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
						<DmcInput
							ref={inputRef}
							type='number'
							className='w-full'
							color='info'
							filled
							dense
							autoFocus
							hideMessage
							hideHint
							onKeyPress={handleKeyPress}
							onBlur={() => handleSave()}
						/>
					</DmcItemSection>
				)}

				<DmcItemSection side>{item.sum}</DmcItemSection>
				<DmcItemSection side>
					<DmcBtn
						size='sm'
						color='info'
						loading={isLoading}
						onClick={() => setEditMode(true)}
					>
						<TbCirclePlus />
					</DmcBtn>
				</DmcItemSection>
			</DmcItem>
		)
	}
)

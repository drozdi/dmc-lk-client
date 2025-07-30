import { useRef, useState } from 'react'
import { TbCirclePlus } from 'react-icons/tb'
import { useQuery } from '../../../../../shared/hooks'
import {
	DmcBtn,
	DmcInput,
	DmcItem,
	DmcItemSection,
} from '../../../../../shared/ui'
import { requestLabelsCountAdd } from '../../../api'
export function ReportItem({
	item,
	warningLimits,
	dangerLimits,
}: {
	item: {
		add_label_format: string
		sum: number
		production_id: number
	}
	warningLimits: number
	dangerLimits: number
}) {
	const { request, isLoading } = useQuery(requestLabelsCountAdd)
	const inputRef = useRef()
	const [editMode, setEditMode] = useState<boolean>(false)
	const handleSave = async () => {
		if (inputRef.current.value) {
			await request({
				count_label: inputRef.current.value,
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
		<DmcItem
			color={
				item.sum < dangerLimits
					? item.sum < warningLimits
						? 'warning'
						: 'danger'
					: ''
			}
		>
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

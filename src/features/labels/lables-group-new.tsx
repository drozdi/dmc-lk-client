import { useStoreUserProfile } from "@/entites/auth";
import {
	useGrouped,
	useProductionCount,
	useStoreLabels
} from "@/entites/labels";
import { SelectProductions } from "@/entites/users";
import { notification } from "@/shared/notification";
import { Loading, Text } from "@/shared/ui";
import {
	Center,
	Group,
	NumberFormatter,
	SimpleGrid,
	Stack
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { Children, cloneElement, useEffect, useState } from "react";
import { TbX } from "react-icons/tb";
import { Container } from "./ui/container";
import { Item } from "./ui/item";

import {
	closestCenter, DndContext,
	KeyboardSensor,
	PointerSensor,
	useDraggable,
	useDroppable, useSensor,
	useSensors
} from '@dnd-kit/core';

interface DddContainerProps {
  id: string;
  children: React.ReactNode;
}
interface DddItemProps {
  id: string;
  containerId: string;
	children: React.ReactNode;
}
interface DddProviderProps {
	children: React.ReactNode;
}
function DddProvider ({ children }: DddProviderProps) {
	const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Элемент начнет перетаскивание только после смещения на 5px
      },
    }),
    useSensor(KeyboardSensor)
  );
	function handleDragEnd (event) {
		console.log(event)
	}
	return <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
			{children}
		</DndContext>
}

function DddContainer ({ id, children }: DddContainerProps) {
	  const { setNodeRef, isOver } = useDroppable({ id });

	return cloneElement(Children.only(children), {
		ref: setNodeRef,
		dataDroppableId: id,
		style: {
			overflow: 'visible',
		}
	});
}

function DddItem ({ id, children }: DddItemProps) {
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.8 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
      }
    : {
        opacity: isDragging ? 0.8 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
      };


	return cloneElement(Children.only(children), {
		ref: setNodeRef,
		style: style,
		...listeners,
		...attributes,
	});


}



export const LabelsGroup = () => {
	const production_id = Number(useStoreUserProfile(state => state.production_id)) || 0;

	const storeLabels = useStoreLabels();
	const storeUserProfile = useStoreUserProfile();
	const containers = useGrouped(production_id);

	const [newFormat, setNewFormat] = useState<string>("");
	const [error, setError] = useState<string>("");
	const formats = Object.keys(containers).filter((item) => item !== ".default");

	

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
				production_id: production_id,
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

	useEffect(() => {
		storeLabels.load();
	}, []);

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
	const count = useProductionCount(production_id)
	

	return (
		<Loading active={storeLabels.isLoading} keepMounted>
				<DddProvider>
					<SimpleGrid cols={4}>
						{formats.map((item) => (
							<DddContainer
								key={item}
								id={item}
							>
								<Container label={item} menu={[
									{ 
										children: 'Удалить', 
										onClick: () => handleDeleteFormat(item),
										rightSection: <TbX />,
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
										<DddItem key={label.id} id={label.id} containerId={item}>
											<Item>{label.id}</Item>
										</DddItem>
									))}
								</Container>
							</DddContainer>
						))}
						<DddContainer
							id=".default"
						>
							<Container label="Без группы" title={<Group justify="space-between">
									<Text>
										Количество:
									</Text>
									<Text>
										Метраж:
									</Text>
								</Group>}>
								{(containers[".default"] || []).map((item) => (
									<DddItem key={item.id} id={item.id} data={item}>
										<Item 
											sum={count.not_distributed.find((count) => count.add_label_format === item.id)?.sum || 0} 
											sum_consumption={count.not_distributed.find((count) => count.add_label_format === item.id)?.sum_consumption || 0}
										>{item.id}</Item>
									</DddItem>
								))}
							</Container>
						</DddContainer>
					</SimpleGrid>
				</DddProvider>
		</Loading>
	);
};

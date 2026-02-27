import {
	useQueryProductions,
	useQueryUsersRead,
	useQueryUsersUpdate,
} from "@/entites/users";
import { Item, ItemSection, List, Loading, PhoneInput } from "@/shared/ui";
import { Button, Checkbox, Group, Stack, Tabs, TextInput } from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { Template } from "@t";
import { useEffect, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

interface UserFormProps {
	id?: IUsersUser["id"];
	className?: string;
}

export const UserForm = ({ id, className }: UserFormProps) => {
	const { data: products } = useQueryProductions();
	const naigate = useNavigate();
	const { isLoading, error, isError, data } = useQueryUsersRead(Number(id));

	const { mutate } = useQueryUsersUpdate();
	// const reqUserGet = useQuery(requestUsersGet, 'Пользователь не найден')
	// const reqUserUpdate = useQuery(requestUsersUpdate)

	const form = useForm<IUsersUser>({
		mode: "uncontrolled",
		name: "userForm",
		initialValues: {
			id: 0,
			first_name: "",
			last_name: "",
			father_name: "",
			email: "",
			phone: "",
			is_active: true,
			is_superuser: false,
			id_production: [],
		},
		validate: {
			first_name: isNotEmpty("Укажите имя"),
			last_name: isNotEmpty("Укажите фамилию"),
			father_name: isNotEmpty("Укажите отчество"),
			email: isEmail("Введите корректный email"),
			/*phone: matches(
				/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
				'Неверный номер телефона'
			),*/
		},
		enhanceGetInputProps: ({ inputProps, options }) => {
			if (options.type === "checkbox") {
				return {
					checked: inputProps.defaultChecked,
				};
			}
		},
	});

	useEffect(() => {
		if (data?.email && !form.initialized) {
			const user = {
				is_active: true,
				is_superuser: false,
				...data,
			} as IUsersUser;
			user.id_production = (user.id_production || []).map(
				(item: unknown) => String(item),
			);
			form.initialize(user);
		}
	}, [data]);

	async function handleSave(formData: IUsersUser) {
		mutate(formData);
	}
	async function handleSaveNavigate(formData: IUsersUser) {
		mutate(formData);
		naigate("/users");
	}

	const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { value, checked } = event.currentTarget;
		form.setFieldValue("id_production", (currentItems) =>
			checked
				? [...currentItems, value]
				: currentItems.filter((item) => item !== value),
		);
	};

	const isValid = !(Number(form.errors.length) > 0);

	return (
		<>
			<Template.Title>
				Пользователь -{" "}
				{[data?.last_name, data?.first_name, data?.father_name].join(
					" ",
				)}
			</Template.Title>
			<Loading active={isLoading} keepMounted>
				<form>
					<Tabs defaultValue="tab-general">
						<Tabs.List grow>
							<Tabs.Tab value="tab-general">Общие</Tabs.Tab>
							<Tabs.Tab value="tab-product">Площадки</Tabs.Tab>
						</Tabs.List>
						<Tabs.Panel value="tab-general">
							<Group>
								<Stack flex={1}>
									<TextInput
										label="Фамилия"
										placeholder="Фамилия"
										required
										variant="underline"
										{...form.getInputProps("last_name")}
									/>
									<TextInput
										label="Имя"
										placeholder="Имя"
										required
										variant="underline"
										{...form.getInputProps("first_name")}
									/>
									<TextInput
										label="Отчество"
										placeholder="Отчество"
										required
										variant="underline"
										{...form.getInputProps("father_name")}
									/>
								</Stack>
								<Stack flex={1}>
									<Checkbox
										label="Активный"
										{...form.getInputProps("is_active", {
											type: "checkbox",
										})}
									/>
									<Checkbox
										label="Суперпользователь"
										{...form.getInputProps("is_superuser", {
											type: "checkbox",
										})}
									/>
									<TextInput
										placeholder="Email"
										type="email"
										required
										variant="underline"
										{...form.getInputProps("email")}
									/>
									<PhoneInput
										placeholder="Телефон"
										type="phone"
										required
										variant="underline"
										{...form.getInputProps("phone")}
									/>
								</Stack>
							</Group>
						</Tabs.Panel>
						<Tabs.Panel value="tab-product">
							<List dense separator>
								{products?.length &&
									products.map((product) => (
										<Item
											component="label"
											key={product.production_id}
										>
											<ItemSection top row>
												{product.production_name}
											</ItemSection>
											<ItemSection side>
												<input
													type="checkbox"
													onChange={
														handleCheckboxChange
													}
													checked={form.values.id_production.includes(
														String(
															product.production_id,
														),
													)}
													value={String(
														product.production_id,
													)}
												/>
											</ItemSection>
										</Item>
									))}
							</List>
						</Tabs.Panel>
					</Tabs>

					<Template.Footer>
						<Group>
							<Button
								color="green"
								onClick={() =>
									form.onSubmit(handleSaveNavigate)()
								}
								loading={isLoading}
								disabled={isError || !isValid}
							>
								Сохранить
							</Button>
							<Button
								onClick={() => form.onSubmit(handleSave)()}
								loading={isLoading}
								disabled={isError || !isValid}
							>
								Применить
							</Button>
						</Group>
					</Template.Footer>
				</form>
			</Loading>
		</>
	);
};

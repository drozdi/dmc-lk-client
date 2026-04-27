import { createStore, type StateCreator } from "zustand";

type DbPersistOptions<T> = {
	key: string;
	load: (key: string) => Promise<T>;
	save: (key: string, state: T) => Promise<void>;
	debounceMs?: number;
	serialize?: (state: T) => string;
	deserialize?: (saved: string) => T;
};

export function dbPersist<T>(
	options: DbPersistOptions<T>,
): (config: StateCreator<T, [], []>) => StateCreator<T, [], []> {
	const {
		key,
		load,
		save,
		debounceMs = 500,
		serialize = JSON.stringify,
		deserialize = JSON.parse,
	} = options;

	return (config) => (set, get, api) => {
		// Флаг, чтобы не отправлять сохранение во время загрузки из БД
		let isHydrating = false;
		let timeoutId: ReturnType<typeof setTimeout> | null = null;

		// Функция сохранения с debounce
		const persistState = (state: T) => {
			if (isHydrating) return;

			if (timeoutId) clearTimeout(timeoutId);
			timeoutId = setTimeout(async () => {
				try {
					await save(key, state);
				} catch (error) {
					console.error(
						`[dbPersist] Ошибка сохранения состояния для ключа "${key}":`,
						error,
					);
				}
			}, debounceMs);
		};

		// Сначала создаём стор с исходным состоянием
		const initialState = config(set, get, api);
		const store = createStore(set, get, api, initialState);

		// Асинхронная гидратация – загружаем данные из БД и обновляем стор
		(async () => {
			try {
				const savedData = await load(key);
				if (savedData !== undefined && savedData !== null) {
					isHydrating = true;
					// Мержим загруженные данные с текущим состоянием
					set((state) => ({ ...state, ...savedData }));
					isHydrating = false;
					console.log(
						`[dbPersist] Состояние для ключа "${key}" успешно загружено`,
					);
				}
			} catch (error) {
				console.error(
					`[dbPersist] Ошибка загрузки состояния для ключа "${key}":`,
					error,
				);
			}
		})();

		// Подписываемся на изменения стора и сохраняем их в БД
		api.subscribe((state, prevState) => {
			if (!isHydrating && state !== prevState) {
				persistState(state);
			}
		});

		// Возвращаем итоговый стор (необходимо для корректной работы middleware)
		return store;
	};
}

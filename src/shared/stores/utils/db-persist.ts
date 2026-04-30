import {
	type StateCreator,
	type StoreApi,
	type StoreMutatorIdentifier,
} from "zustand";

type DbPersistOptions<T> = {
	key: string;
	load: (key: string) => Promise<T>;
	save: (key: string, state: T) => Promise<void>;
	loadOnInit?: boolean;
	delay?: number;
};

// Сигнатура middleware для совместимости с zustand
export const dbPersist = <T>(
	options: DbPersistOptions<T>,
): (<Mos extends [StoreMutatorIdentifier, unknown][] = []>(
	config: StateCreator<T, [], Mos>,
) => StateCreator<T, [], Mos>) => {
	const { key, load, save, delay = 1000, loadOnInit = true } = options;
	return (config) => (set, get, api) => {
		let isHydrating = false;
		let loaded = false;
		let timeoutId: ReturnType<typeof setTimeout> | null = null;

		const persistState = (state: T) => {
			if (isHydrating) {
				return;
			}
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			timeoutId = setTimeout(async () => {
				try {
					await save(key, state);
				} catch (error) {
					console.error(`[dbPersist] Save error (${key}):`, error);
				}
			}, delay);
		};

		const initialData = config(set, get, api);
		const initialState = {
			...initialData,
			$loaded: false,
			$reload: async (): Promise<void> => {
				try {
					const savedData = await load(key);

					if (savedData !== undefined && savedData !== null) {
						isHydrating = true;
						set((state) => ({ ...state, ...savedData }));
						isHydrating = false;
					}
				} catch (error) {
					console.error(`[dbPersist] Load error (${key}):`, error);
				}
			},
		};

		if (loadOnInit && !loaded && load) {
			(async () => {
				if (initialState.$loaded) {
					return;
				}
				try {
					const savedData = await load(key);
					if (
						savedData !== undefined &&
						savedData !== null &&
						Object.values(savedData).length
					) {
						isHydrating = true;
						set((state) => ({ ...state, ...savedData }));
						isHydrating = false;
						initialState.$loaded = true;
					}
				} catch (error) {
					console.error(`[dbPersist] Load error (${key}):`, error);
				}
			})();
		}

		api.subscribe((state, prevState) => {
			if (!isHydrating && state !== prevState) {
				persistState(state);
			}
		});

		return initialState;
	};
};

interface DbMiddlewareOptions<T> {
	key: string;
	default: Partial<T>;
	// Функция сохранения (state -> Promise или void)
	save: (key: string, state: T) => Promise<void> | void;
	// Функция загрузки (возвращает загруженное состояние или его часть)
	load?: (key: string) => Promise<Partial<T> | T>;
	// Задержка перед сохранением (мс), для снижения частоты запросов
	delay?: number;
	// Колбэк ошибок (по умолчанию console.error)
	onError?: (error: Error) => void;
	// Флаг, нужно ли загружать состояние при создании хранилища
	loadOnInit?: boolean;
}

// Создаём middleware с сохранением в БД
export const dbMiddleware = <T>(
	config: StateCreator<T>,
	options: DbMiddlewareOptions<T>,
): StateCreator<T> => {
	const {
		key,
		save,
		load,
		default: def = {},
		delay = 500,
		onError = console.error,
		loadOnInit = true,
	} = options;

	// Возвращаем обёрнутую функцию конфигурации
	return (set, get, api) => {
		let saveTimeout: ReturnType<typeof setTimeout> | null = null;
		let isHydrating = false;
		let loaded = false;

		const wrappedSet: typeof set = (state, replace) => {
			set(state, replace);
			if (isHydrating) {
				return;
			}
			if (saveTimeout !== null) {
				clearTimeout(saveTimeout);
			}
			saveTimeout = setTimeout(async () => {
				try {
					await save(key, get());
				} catch (err) {
					onError(
						"[dbMiddleware] Satter error: ",
						err instanceof Error ? err : new Error(String(err)),
					);
				} finally {
					saveTimeout = null;
				}
			}, delay);
		};

		// Расширенный API: добавление методов для ручного управления
		const extendedApi = api as StoreApi<T> & {
			saveNow: () => Promise<void>;
			resetFromDB: () => Promise<void>;
		};

		extendedApi.saveNow = async () => {
			if (saveTimeout !== null) {
				clearTimeout(saveTimeout);
				saveTimeout = null;
			}
			try {
				await save(key, get());
			} catch (err) {
				onError(
					"[dbMiddleware] Save error: ",
					err instanceof Error ? err : new Error(String(err)),
				);
				throw err;
			}
		};

		extendedApi.resetFromDB = async () => {
			if (!load) {
				onError(new Error("[dbMiddleware] load function not provided"));
				return;
			}
			try {
				isHydrating = true;
				const loadedState = await load(key);
				set(loadedState);
				loaded = true;
			} catch (err) {
				onError(
					`[dbMiddleware] Reload error (${key}):`,
					err instanceof Error ? err : new Error(String(err)),
				);
			} finally {
				isHydrating = false;
			}
		};

		// Вызываем оригинальную конфигурацию с обёрнутым set
		const result = config(wrappedSet, get, extendedApi);

		// Асинхронная гидратация из БД после создания хранилища
		if (loadOnInit && load) {
			// Запускаем загрузку, но не блокируем создание хранилища
			(async () => {
				if (loaded) {
					return;
				}
				try {
					isHydrating = true;
					const loadedState = await load(key);
					set(loadedState || def);
					loaded = true;
				} catch (err) {
					set(def);
					onError(
						`[dbMiddleware] Load error (${key}):`,
						err instanceof Error ? err : new Error(String(err)),
					);
				} finally {
					isHydrating = false;
				}
			})();
		}

		return result;
	};
};

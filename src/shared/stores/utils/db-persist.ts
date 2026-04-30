import { type StateCreator, type StoreApi } from "zustand";

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
			if (!loaded) {
				return;
			}
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
				loaded = true;
			} catch (err) {
				onError(
					"[dbMiddleware] Save now error: ",
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
					await extendedApi.saveNow();
				}
			})();
		}

		return result;
	};
};

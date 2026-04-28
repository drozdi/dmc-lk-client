import { type StateCreator, type StoreMutatorIdentifier } from "zustand";

type DbPersistOptions<T> = {
	key: string;
	load: (key: string) => Promise<T>;
	save: (key: string, state: T) => Promise<void>;
	delay?: number;
};

// Сигнатура middleware для совместимости с zustand
export const dbPersist = <T>(
	options: DbPersistOptions<T>,
): (<Mos extends [StoreMutatorIdentifier, unknown][] = []>(
	config: StateCreator<T, [], Mos>,
) => StateCreator<T, [], Mos>) => {
	const { key, load, save, delay = 1000 } = options;
	return (config) => (set, get, api) => {
		let isHydrating = false;
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

		(async () => {
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
				}
			} catch (error) {
				console.error(`[dbPersist] Load error (${key}):`, error);
			}
		})();

		api.subscribe((state, prevState) => {
			if (!isHydrating && state !== prevState) {
				persistState(state);
			}
		});

		return initialState;
	};
};

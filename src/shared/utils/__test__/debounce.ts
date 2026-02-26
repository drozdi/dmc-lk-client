import { debounce } from '../debounce'

describe('@/shared/utils/debounce', () => {
	const tt = vi || jest

	beforeEach(() => {
		tt.useFakeTimers()
	})

	afterEach(() => {
		tt.useRealTimers()
	})

	it('вызывает функцию только один раз после паузы', () => {
		const mockFn = tt.fn()
		const debouncedFn = debounce(mockFn, 1000)

		// Быстрые последовательные вызовы
		debouncedFn('call 1')
		debouncedFn('call 2')
		debouncedFn('call 3')

		// Функция еще не вызвана
		expect(mockFn).not.toHaveBeenCalled()

		// Перемещаем время вперед на 1000мс
		tt.advanceTimersByTime(1000)

		// Функция вызвана только один раз с последним аргументом
		expect(mockFn).toHaveBeenCalledTimes(1)
		expect(mockFn).toHaveBeenCalledWith('call 3')
	})

	it('сбрасывает таймер при новых вызовах', () => {
		const mockFn = tt.fn()
		const debouncedFn = debounce(mockFn, 500)

		debouncedFn()
		tt.advanceTimersByTime(300)
		debouncedFn() // Сбрасываем таймер
		tt.advanceTimersByTime(300) // Всего 600мс с первого вызова

		// Еще не прошло 500мс с последнего вызова
		expect(mockFn).not.toHaveBeenCalled()

		tt.advanceTimersByTime(200) // Всего 800мс с первого вызова
		expect(mockFn).toHaveBeenCalledTimes(1)
	})
})

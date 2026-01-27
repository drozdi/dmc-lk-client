import '@testing-library/dom'
import '@testing-library/jest-dom/vitest'
import '@testing-library/react'
import 'vitest'
import { setupVitestCanvasMock } from 'vitest-canvas-mock'

beforeEach(() => {
	vi.resetAllMocks()
	setupVitestCanvasMock()
})

/**
 * KCD Best Practice: Global test setup.
 *
 * - Start MSW server before all tests
 * - Reset handlers after each test (prevents test pollution)
 * - Clean up after all tests
 */
import '@testing-library/jest-dom/vitest'
import { server } from '@/mocks/server'
import { resetDb } from '@/mocks/handlers'

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
  resetDb()
})

afterAll(() => {
  server.close()
})

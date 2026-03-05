/**
 * KCD Best Practice: Global test setup.
 *
 * - Start MSW server before all tests
 * - Reset handlers after each test (prevents test pollution)
 * - Clean up after all tests
 */
import '@testing-library/jest-dom/vitest'
import { server } from '@/mocks/server'
import { resetDb, resetProfileDb, resetPurchasesDb } from '@/mocks/handlers'

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
  // Reset every service DB to its fixture state after each test.
  // Add new service resets here as more services are introduced.
  resetDb()
  resetProfileDb()
  resetPurchasesDb()
})

afterAll(() => {
  server.close()
})

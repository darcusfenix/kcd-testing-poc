import { handlers as userHandlers } from './users'
import { profileHandlers } from './profile'
import { purchasesHandlers } from './purchases'

/**
 * All MSW handlers composed in one place.
 * Add new service handlers here as new services are introduced.
 */
export const handlers = [
  ...userHandlers,
  ...profileHandlers,
  ...purchasesHandlers,
]

// Re-export individual reset functions for test setup
export { resetDb, seedDb } from './users'
export { resetProfileDb, seedProfileDb } from './profile'
export { resetPurchasesDb, seedPurchasesDb } from './purchases'

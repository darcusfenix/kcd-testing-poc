/**
 * KCD Best Practice: MSW server for Node.js (tests).
 *
 * This is used by Vitest tests. The handlers are the same ones
 * used in the browser worker, ensuring mock consistency.
 */
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)

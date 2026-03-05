/**
 * KCD Best Practice: MSW browser worker for development mode.
 *
 * Uses the exact same handlers as tests, so the app behaves
 * consistently whether running with real or mocked APIs.
 *
 * To run the app with mocks: VITE_MOCK_API=true npm run dev
 */
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

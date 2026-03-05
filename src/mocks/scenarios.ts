/**
 * Mock scenarios for local development.
 *
 * Each scenario can override the DB seed and/or inject MSW handler overrides
 * that take priority over the default handlers (first match wins in MSW).
 *
 * The selected scenario key is persisted in localStorage so it survives
 * page refreshes. Switching scenarios triggers a reload so the worker
 * re-initialises with the correct handlers and DB state.
 */
import { http, HttpResponse } from 'msw'
import type { RequestHandler } from 'msw'
import { seedDb, resetDb, setExtraDelay } from './handlers/users'
import { buildUsers } from './fixtures/generate-users'

export type ScenarioKey = keyof typeof SCENARIOS

export type Scenario = {
  label: string
  description: string
  seed?: () => void
  handlers?: RequestHandler[]
}

export const SCENARIOS = {
  default: {
    label: 'Default',
    description: '5 fixture users (happy path)',
    seed: resetDb,
  },

  empty: {
    label: 'Empty state',
    description: 'No users — shows empty state UI',
    seed: () => seedDb([]),
  },

  'large-dataset': {
    label: 'Large dataset',
    description: '50 users — exercises pagination',
    seed: () => seedDb(buildUsers(50)),
  },

  'all-inactive': {
    label: 'All inactive',
    description: '10 users, all inactive',
    seed: () => seedDb(buildUsers(10, { status: 'inactive' })),
  },

  'list-error': {
    label: 'List error (500)',
    description: 'GET /api/users returns 500',
    seed: resetDb,
    handlers: [
      http.get('/api/users', () => {
        return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 })
      }),
    ],
  },

  'delete-error': {
    label: 'Delete error (500)',
    description: 'DELETE /api/users/:id returns 500',
    seed: resetDb,
    handlers: [
      http.delete('/api/users/:id', () => {
        return HttpResponse.json({ message: 'Could not delete user' }, { status: 500 })
      }),
    ],
  },

  'slow-network': {
    label: 'Slow network',
    description: 'List endpoint takes 3 s — shows loading state',
    seed: () => { resetDb(); setExtraDelay(3000) },
  },
} satisfies Record<string, Scenario>

const STORAGE_KEY = 'msw-scenario'

export function getActiveScenarioKey(): ScenarioKey {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && stored in SCENARIOS) return stored as ScenarioKey
  return 'default'
}

export function setActiveScenarioKey(key: ScenarioKey) {
  localStorage.setItem(STORAGE_KEY, key)
}

export function getActiveScenario(): Scenario {
  return SCENARIOS[getActiveScenarioKey()]
}

/**
 * KCD Best Practice: MSW handlers shared between development and tests.
 *
 * These handlers define the "happy path" behavior. Tests can override
 * individual handlers for error scenarios using server.use() per-test.
 *
 * This single source of mock definitions ensures consistency across:
 * - Unit/integration tests (via setupServer)
 * - Development mode (via setupWorker)
 * - E2E tests (via setupWorker or a mock server)
 */
import { http, HttpResponse, delay } from 'msw'
import { users as fixtureUsers } from '../fixtures/users'
import { filterUsers, sortUsers } from '@/utils/format-user'
import type { User, UserSortField, SortDirection } from '@/types/user'

// In-memory database for the mock - shared state for the session
let db: User[] = [...fixtureUsers]

export function resetDb() {
  db = [...fixtureUsers]
}

export function seedDb(users: User[]) {
  db = [...users]
}

export const handlers = [
  // GET /api/users - list with pagination, search, sort
  http.get('/api/users', async ({ request }) => {
    // Simulate network latency (realistic for tests)
    await delay(100)

    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || '1')
    const perPage = Number(url.searchParams.get('perPage') || '10')
    const search = url.searchParams.get('search') || ''
    const status = url.searchParams.get('status') || 'all'
    const sortBy = (url.searchParams.get('sortBy') || 'name') as UserSortField
    const sortDirection = (url.searchParams.get('sortDirection') || 'asc') as SortDirection

    let result = [...db]

    // Filter by status
    if (status !== 'all') {
      result = result.filter((u) => u.status === status)
    }

    // Filter by search
    result = filterUsers(result, search)

    // Sort
    result = sortUsers(result, sortBy, sortDirection)

    // Paginate
    const total = result.length
    const totalPages = Math.ceil(total / perPage)
    const start = (page - 1) * perPage
    const data = result.slice(start, start + perPage)

    return HttpResponse.json({
      data,
      total,
      page,
      perPage,
      totalPages,
    })
  }),

  // GET /api/users/:id - single user
  http.get('/api/users/:id', async ({ params }) => {
    await delay(50)
    const id = Number(params.id)
    const user = db.find((u) => u.id === id)

    if (!user) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(user)
  }),

  // DELETE /api/users/:id
  http.delete('/api/users/:id', async ({ params }) => {
    await delay(50)
    const id = Number(params.id)
    const index = db.findIndex((u) => u.id === id)

    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    db.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]

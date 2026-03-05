/**
 * KCD Best Practice: Factory functions for test data
 *
 * Instead of importing massive JSON files directly, we use factory functions
 * that generate realistic data on demand. This approach:
 *
 * 1. Keeps test files small and focused
 * 2. Makes data requirements explicit per test
 * 3. Allows overrides for specific test scenarios
 * 4. Avoids loading 5k+ line JSON files into memory for every test
 *
 * For large responses (5k+ lines), we generate data programmatically and
 * keep only small representative fixtures checked in.
 */
import type { User, PaginatedResponse } from '@/types/user'

let idCounter = 1

const FIRST_NAMES = [
  'Leanne', 'Ervin', 'Clementine', 'Patricia', 'Chelsey',
  'Dennis', 'Kurtis', 'Nicholas', 'Glenna', 'Clementina',
  'James', 'Maria', 'Robert', 'Linda', 'Michael',
  'Barbara', 'William', 'Elizabeth', 'David', 'Jennifer',
]

const LAST_NAMES = [
  'Graham', 'Howell', 'Bauch', 'Lebsack', 'Dietrich',
  'Schulist', 'Weissnat', 'Runolfsdottir', 'Reichert', 'DuBuque',
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones',
  'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
]

const COMPANIES = [
  'Romaguera-Crona', 'Deckow-Crist', 'Romaguera-Jacobson',
  'Robel-Corkery', 'Keebler LLC', 'Considine-Lockman',
  'Johns Group', 'Abernathy Group', 'Yost and Sons', 'Hoeger LLC',
]

const CITIES = [
  'Gwenborough', 'Wisokyburgh', 'McKenziehaven', 'South Elvis',
  'Roscoeview', 'South Christy', 'Howemouth', 'Aliyaview',
  'Bartholomebury', 'Lebsackbury',
]

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Build a single user with sensible defaults and optional overrides.
 *
 * KCD Pattern: "Build" functions let tests specify only what matters,
 * keeping tests focused on the scenario being tested.
 */
export function buildUser(overrides: Partial<User> = {}): User {
  const id = overrides.id ?? idCounter++
  const firstName = randomFrom(FIRST_NAMES)
  const lastName = randomFrom(LAST_NAMES)
  const name = `${firstName} ${lastName}`
  const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`

  return {
    id,
    name,
    username,
    email: `${username}@example.com`,
    address: {
      street: `${Math.floor(Math.random() * 9999)} Main St`,
      suite: `Apt. ${Math.floor(Math.random() * 999)}`,
      city: randomFrom(CITIES),
      zipcode: `${Math.floor(10000 + Math.random() * 89999)}`,
      geo: {
        lat: `${(Math.random() * 180 - 90).toFixed(4)}`,
        lng: `${(Math.random() * 360 - 180).toFixed(4)}`,
      },
    },
    phone: `${Math.floor(100 + Math.random() * 899)}-${Math.floor(100 + Math.random() * 899)}-${Math.floor(1000 + Math.random() * 8999)}`,
    website: `${username}.org`,
    company: {
      name: randomFrom(COMPANIES),
      catchPhrase: 'Multi-layered client-server neural-net',
      bs: 'harness real-time e-markets',
    },
    status: Math.random() > 0.3 ? 'active' : 'inactive',
    ...overrides,
  }
}

/**
 * Build an array of users.
 *
 * KCD Pattern: For large datasets (like 5k+ line API responses),
 * generate them programmatically rather than maintaining huge JSON fixtures.
 */
export function buildUsers(
  count: number,
  overrides: Partial<User> = {},
): User[] {
  return Array.from({ length: count }, (_, i) =>
    buildUser({ id: i + 1, ...overrides }),
  )
}

/**
 * Build a paginated response matching the API shape.
 */
export function buildPaginatedResponse(
  users: User[],
  { page = 1, perPage = 10 }: { page?: number; perPage?: number } = {},
): PaginatedResponse<User> {
  const start = (page - 1) * perPage
  const paginatedUsers = users.slice(start, start + perPage)

  return {
    data: paginatedUsers,
    total: users.length,
    page,
    perPage,
    totalPages: Math.ceil(users.length / perPage),
  }
}

/**
 * Reset the ID counter (useful in test setup).
 */
export function resetUserIdCounter() {
  idCounter = 1
}

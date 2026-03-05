/**
 * KCD Best Practice: Test your test utilities.
 *
 * Factory functions are code too - verify they produce
 * valid data, especially when used to simulate large responses.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import {
  buildUser,
  buildUsers,
  buildPaginatedResponse,
  resetUserIdCounter,
} from './generate-users'

describe('buildUser', () => {
  it('creates a user with all required fields', () => {
    const user = buildUser()

    expect(user).toHaveProperty('id')
    expect(user).toHaveProperty('name')
    expect(user).toHaveProperty('email')
    expect(user).toHaveProperty('address')
    expect(user).toHaveProperty('company')
    expect(user.status).toMatch(/^(active|inactive)$/)
  })

  it('accepts overrides', () => {
    const user = buildUser({ name: 'Test User', status: 'active' })

    expect(user.name).toBe('Test User')
    expect(user.status).toBe('active')
  })
})

describe('buildUsers', () => {
  beforeEach(() => {
    resetUserIdCounter()
  })

  it('creates the specified number of users', () => {
    const users = buildUsers(50)
    expect(users).toHaveLength(50)
  })

  it('assigns sequential IDs', () => {
    const users = buildUsers(5)
    expect(users.map((u) => u.id)).toEqual([1, 2, 3, 4, 5])
  })

  it('handles large datasets efficiently (simulating 5k+ JSON lines)', () => {
    // A real API might return 200+ users which generates 5k+ lines of JSON
    const users = buildUsers(200)
    expect(users).toHaveLength(200)
    // Verify all users have unique IDs
    const ids = new Set(users.map((u) => u.id))
    expect(ids.size).toBe(200)
  })

  it('applies overrides to all generated users', () => {
    const users = buildUsers(3, { status: 'inactive' })
    expect(users.every((u) => u.status === 'inactive')).toBe(true)
  })
})

describe('buildPaginatedResponse', () => {
  beforeEach(() => {
    resetUserIdCounter()
  })

  it('paginates users correctly', () => {
    const users = buildUsers(25)
    const response = buildPaginatedResponse(users, { page: 1, perPage: 10 })

    expect(response.data).toHaveLength(10)
    expect(response.total).toBe(25)
    expect(response.page).toBe(1)
    expect(response.perPage).toBe(10)
    expect(response.totalPages).toBe(3)
  })

  it('returns correct data for last page', () => {
    const users = buildUsers(25)
    const response = buildPaginatedResponse(users, { page: 3, perPage: 10 })

    expect(response.data).toHaveLength(5)
    expect(response.page).toBe(3)
  })
})

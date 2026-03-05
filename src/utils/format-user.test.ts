/**
 * KCD Best Practice: Unit Tests
 *
 * Unit tests for pure utility functions. These are at the base of the
 * Testing Trophy - simple, fast, no DOM or network needed.
 *
 * Guidelines followed:
 * - Test behavior, not implementation
 * - Use descriptive test names that describe the expected behavior
 * - Arrange-Act-Assert pattern
 * - No mocking needed for pure functions
 */
import { describe, it, expect } from 'vitest'
import {
  formatUserFullAddress,
  formatUserInitials,
  filterUsers,
  sortUsers,
} from './format-user'
import { buildUser } from '@/mocks/fixtures/generate-users'

describe('formatUserFullAddress', () => {
  it('formats a full address from user data', () => {
    const user = buildUser({
      address: {
        street: '556 Kulas Light',
        suite: 'Apt. 556',
        city: 'Gwenborough',
        zipcode: '92998-3874',
        geo: { lat: '0', lng: '0' },
      },
    })

    expect(formatUserFullAddress(user)).toBe(
      '556 Kulas Light, Apt. 556, Gwenborough 92998-3874',
    )
  })
})

describe('formatUserInitials', () => {
  it('returns first letters of first and last name', () => {
    expect(formatUserInitials('John Doe')).toBe('JD')
  })

  it('handles single name', () => {
    expect(formatUserInitials('Madonna')).toBe('M')
  })

  it('limits to two characters for names with many parts', () => {
    expect(formatUserInitials('Mary Jane Watson Parker')).toBe('MJ')
  })
})

describe('filterUsers', () => {
  const users = [
    buildUser({ id: 1, name: 'Alice Smith', email: 'alice@example.com', company: { name: 'Acme Corp', catchPhrase: '', bs: '' } }),
    buildUser({ id: 2, name: 'Bob Jones', email: 'bob@example.com', company: { name: 'Tech Inc', catchPhrase: '', bs: '' } }),
    buildUser({ id: 3, name: 'Charlie Brown', email: 'charlie@example.com', company: { name: 'Acme Corp', catchPhrase: '', bs: '' } }),
  ]

  it('returns all users when search is empty', () => {
    expect(filterUsers(users, '')).toHaveLength(3)
  })

  it('filters by name (case insensitive)', () => {
    const result = filterUsers(users, 'alice')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Alice Smith')
  })

  it('filters by email', () => {
    const result = filterUsers(users, 'bob@')
    expect(result).toHaveLength(1)
    expect(result[0].email).toBe('bob@example.com')
  })

  it('filters by company name', () => {
    const result = filterUsers(users, 'acme')
    expect(result).toHaveLength(2)
  })

  it('returns empty array when no match', () => {
    expect(filterUsers(users, 'nonexistent')).toHaveLength(0)
  })
})

describe('sortUsers', () => {
  const users = [
    buildUser({ id: 1, name: 'Charlie', email: 'c@test.com', company: { name: 'Zebra', catchPhrase: '', bs: '' }, status: 'inactive' }),
    buildUser({ id: 2, name: 'Alice', email: 'a@test.com', company: { name: 'Alpha', catchPhrase: '', bs: '' }, status: 'active' }),
    buildUser({ id: 3, name: 'Bob', email: 'b@test.com', company: { name: 'Middle', catchPhrase: '', bs: '' }, status: 'active' }),
  ]

  it('sorts by name ascending', () => {
    const result = sortUsers(users, 'name', 'asc')
    expect(result.map((u) => u.name)).toEqual(['Alice', 'Bob', 'Charlie'])
  })

  it('sorts by name descending', () => {
    const result = sortUsers(users, 'name', 'desc')
    expect(result.map((u) => u.name)).toEqual(['Charlie', 'Bob', 'Alice'])
  })

  it('sorts by company name', () => {
    const result = sortUsers(users, 'company', 'asc')
    expect(result.map((u) => u.company.name)).toEqual([
      'Alpha',
      'Middle',
      'Zebra',
    ])
  })

  it('does not mutate the original array', () => {
    const original = [...users]
    sortUsers(users, 'name', 'asc')
    expect(users).toEqual(original)
  })
})

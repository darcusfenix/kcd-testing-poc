import type { PaginatedResponse, User, UsersQueryParams } from '@/types/user'

const API_BASE = '/api'

export async function fetchUsers(
  params: UsersQueryParams = {},
): Promise<PaginatedResponse<User>> {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.set('page', String(params.page))
  if (params.perPage) searchParams.set('perPage', String(params.perPage))
  if (params.search) searchParams.set('search', params.search)
  if (params.status && params.status !== 'all')
    searchParams.set('status', params.status)
  if (params.sortBy) searchParams.set('sortBy', params.sortBy)
  if (params.sortDirection)
    searchParams.set('sortDirection', params.sortDirection)

  const response = await fetch(`${API_BASE}/users?${searchParams}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.status}`)
  }

  return response.json()
}

export async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`${API_BASE}/users/${id}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch user ${id}: ${response.status}`)
  }

  return response.json()
}

export async function deleteUser(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Failed to delete user ${id}: ${response.status}`)
  }
}

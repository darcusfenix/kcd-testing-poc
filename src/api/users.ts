/**
 * Users API — refactored to use the shared API client factory.
 *
 * Keeps its public interface identical so existing imports continue to work.
 * The underlying HTTP mechanics now go through createApiClient(), giving
 * consistent error handling (HttpError) and base-URL config across all services.
 */
import { usersClient } from '@/services/config'
import type { PaginatedResponse, User, UsersQueryParams } from '@/types/user'

export function fetchUsers(params: UsersQueryParams = {}): Promise<PaginatedResponse<User>> {
  return usersClient.get('/users', {
    ...(params.page                              && { page:          params.page }),
    ...(params.perPage                           && { perPage:       params.perPage }),
    ...(params.search                            && { search:        params.search }),
    ...(params.status && params.status !== 'all' && { status:        params.status }),
    ...(params.sortBy                            && { sortBy:        params.sortBy }),
    ...(params.sortDirection                     && { sortDirection: params.sortDirection }),
  })
}

export function fetchUser(id: number): Promise<User> {
  return usersClient.get(`/users/${id}`)
}

export function deleteUser(id: number): Promise<void> {
  return usersClient.delete(`/users/${id}`)
}

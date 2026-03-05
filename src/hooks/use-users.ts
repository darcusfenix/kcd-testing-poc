import { useCallback, useEffect } from 'react'
import { useAsync } from '@/lib/use-async'
import { fetchUsers } from '@/api/users'
import type { PaginatedResponse, User, UsersQueryParams } from '@/types/user'

export function useUsers(params: UsersQueryParams = {}) {
  const { status, data, error, run } = useAsync<PaginatedResponse<User>>()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(() => run(fetchUsers(params)), [
    run,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(params),
  ])

  useEffect(() => {
    load().catch(() => {}) // error already captured in state
  }, [load])

  return { status, data, error, refetch: load }
}

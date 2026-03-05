import { useCallback, useState } from 'react'
import { useUsers } from '@/hooks/use-users'
import { UserCard } from '@/components/UserCard'
import { SearchInput } from '@/components/SearchInput'
import { StatusFilter } from '@/components/StatusFilter'
import { Pagination } from '@/components/Pagination'
import { deleteUser } from '@/api/users'
import type { UsersQueryParams } from '@/types/user'

export function UsersPage() {
  const [params, setParams] = useState<UsersQueryParams>({
    page: 1,
    perPage: 10,
    status: 'all',
    sortBy: 'name',
    sortDirection: 'asc',
  })

  const { data, status, error, refetch } = useUsers(params)

  const handleSearch = useCallback((search: string) => {
    setParams((prev) => ({ ...prev, search, page: 1 }))
  }, [])

  const handleStatusChange = useCallback(
    (statusFilter: 'all' | 'active' | 'inactive') => {
      setParams((prev) => ({ ...prev, status: statusFilter, page: 1 }))
    },
    [],
  )

  const handlePageChange = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }))
  }, [])

  const handleDelete = useCallback(
    async (id: number) => {
      if (!window.confirm('Are you sure you want to delete this user?')) return
      try {
        await deleteUser(id)
        refetch()
      } catch {
        alert('Failed to delete user. Please try again.')
      }
    },
    [refetch],
  )

  return (
    <div className="users-page">
      <header className="users-page__header">
        <h1>Users</h1>
        <div className="users-page__controls">
          <SearchInput onSearch={handleSearch} />
          <StatusFilter
            value={params.status || 'all'}
            onChange={handleStatusChange}
          />
        </div>
      </header>

      <main>
        {status === 'loading' && (
          <div role="status" aria-label="Loading users">
            <p>Loading users...</p>
          </div>
        )}

        {status === 'error' && (
          <div role="alert" className="error-message">
            <p>Error: {error}</p>
            <button onClick={refetch}>Retry</button>
          </div>
        )}

        {status === 'success' && data && (
          <>
            {data.data.length === 0 ? (
              <p className="no-results">No users found.</p>
            ) : (
              <>
                <p className="users-page__count">
                  Showing {data.data.length} of {data.total} users
                </p>
                <div className="users-page__list">
                  {data.data.map((user) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
                <Pagination
                  page={data.page}
                  totalPages={data.totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}

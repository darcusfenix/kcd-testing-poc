import { useCallback, useEffect, useReducer } from 'react'
import { fetchUsers } from '@/api/users'
import type { PaginatedResponse, User, UsersQueryParams } from '@/types/user'

interface State {
  data: PaginatedResponse<User> | null
  status: 'idle' | 'loading' | 'success' | 'error'
  error: string | null
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: PaginatedResponse<User> }
  | { type: 'FETCH_ERROR'; error: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, status: 'loading', error: null }
    case 'FETCH_SUCCESS':
      return { data: action.payload, status: 'success', error: null }
    case 'FETCH_ERROR':
      return { ...state, status: 'error', error: action.error }
  }
}

export function useUsers(params: UsersQueryParams = {}) {
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    status: 'idle',
    error: null,
  })

  const load = useCallback(async () => {
    dispatch({ type: 'FETCH_START' })
    try {
      const result = await fetchUsers(params)
      dispatch({ type: 'FETCH_SUCCESS', payload: result })
    } catch (err) {
      dispatch({
        type: 'FETCH_ERROR',
        error: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  }, [JSON.stringify(params)])

  useEffect(() => {
    load()
  }, [load])

  return {
    ...state,
    refetch: load,
  }
}

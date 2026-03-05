/**
 * Generic async state machine hook.
 *
 * Replaces per-hook reducer boilerplate. Every service hook that fetches
 * data or runs a mutation gets the same status/data/error shape for free.
 *
 * Usage — data fetch:
 *   const { status, data, error, run } = useAsync<User[]>()
 *   useEffect(() => { run(api.getUsers()) }, [run])
 *
 * Usage — mutation:
 *   const { status, error, run } = useAsync<void>()
 *   const handleSubmit = () => run(api.deleteUser(id))
 */
import { useCallback, useReducer } from 'react'

export interface AsyncState<T> {
  status: 'idle' | 'loading' | 'success' | 'error'
  data: T | null
  error: string | null
}

type AsyncAction<T> =
  | { type: 'PENDING' }
  | { type: 'RESOLVED'; data: T }
  | { type: 'REJECTED'; error: string }

// Preserve previous data during loading / error so UI doesn't flash empty.
function asyncReducer<T>(state: AsyncState<T>, action: AsyncAction<T>): AsyncState<T> {
  switch (action.type) {
    case 'PENDING':
      return { status: 'loading', data: state.data, error: null }
    case 'RESOLVED':
      return { status: 'success', data: action.data, error: null }
    case 'REJECTED':
      return { status: 'error', data: state.data, error: action.error }
  }
}

export function useAsync<T>() {
  const [state, dispatch] = useReducer(
    (s: AsyncState<T>, a: AsyncAction<T>) => asyncReducer(s, a),
    { status: 'idle', data: null, error: null },
  )

  // `dispatch` is stable so `run` never changes reference — safe in dep arrays.
  const run = useCallback(async (promise: Promise<T>): Promise<T> => {
    dispatch({ type: 'PENDING' })
    try {
      const data = await promise
      dispatch({ type: 'RESOLVED', data })
      return data
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error'
      dispatch({ type: 'REJECTED', error })
      throw err
    }
  }, [])

  return { ...state, run }
}

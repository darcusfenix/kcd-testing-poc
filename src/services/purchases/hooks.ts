import { useCallback, useEffect } from 'react'
import { useAsync } from '@/lib/use-async'
import { purchasesApi } from './api'
import type { PaginatedPurchases, Purchase, PurchasesQueryParams } from './types'

export function usePurchases(params: PurchasesQueryParams = {}) {
  const { status, data, error, run } = useAsync<PaginatedPurchases>()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(() => run(purchasesApi.listPurchases(params)), [
    run,
    // Stable serialisation as dependency — params object ref changes on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(params),
  ])

  useEffect(() => {
    load().catch(() => {}) // error already captured in state
  }, [load])

  return { status, data, error, refetch: load }
}

export function useCancelPurchase() {
  const { status, error, run } = useAsync<Purchase>()

  const cancel = useCallback(
    (id: string) => run(purchasesApi.cancelPurchase(id)),
    [run],
  )

  return { status, error, cancel }
}

import { purchasesClient } from '@/services/config'
import type { PaginatedPurchases, Purchase, PurchasesQueryParams } from './types'

export const purchasesApi = {
  listPurchases: (params: PurchasesQueryParams = {}) =>
    purchasesClient.get<PaginatedPurchases>('/purchases', {
      ...(params.page     && { page:    params.page }),
      ...(params.perPage  && { perPage: params.perPage }),
      ...(params.status && params.status !== 'all' && { status: params.status }),
    }),

  getPurchase: (id: string) =>
    purchasesClient.get<Purchase>(`/purchases/${id}`),

  cancelPurchase: (id: string) =>
    purchasesClient.patch<Purchase>(`/purchases/${id}`, { status: 'cancelled' }),
}

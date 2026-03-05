export type PurchaseStatus = 'pending' | 'completed' | 'cancelled' | 'refunded'

export interface Purchase {
  id: string
  productName: string
  vendor: string
  /** Amount in cents (e.g. 9900 = $99.00) */
  amount: number
  currency: string
  status: PurchaseStatus
  purchasedAt: string
  description: string
}

export interface PurchasesQueryParams {
  page?: number
  perPage?: number
  status?: PurchaseStatus | 'all'
}

export interface PaginatedPurchases {
  data: Purchase[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

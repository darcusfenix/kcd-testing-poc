import { useCallback, useState } from 'react'
import { usePurchases, useCancelPurchase } from '@/services/purchases/hooks'
import { Pagination } from '@/components/Pagination'
import type { PurchaseStatus, PurchasesQueryParams } from '@/services/purchases/types'

const STATUS_OPTIONS: { value: PurchaseStatus | 'all'; label: string }[] = [
  { value: 'all',       label: 'All' },
  { value: 'pending',   label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded',  label: 'Refunded' },
]

function formatAmount(cents: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const STATUS_CLASSES: Record<PurchaseStatus, string> = {
  pending:   'badge badge--pending',
  completed: 'badge badge--completed',
  cancelled: 'badge badge--cancelled',
  refunded:  'badge badge--refunded',
}

export function PurchasesPage() {
  const [params, setParams] = useState<PurchasesQueryParams>({
    page:     1,
    perPage:  10,
    status:   'all',
  })

  const { status, data, error, refetch } = usePurchases(params)
  const { status: cancelStatus, cancel } = useCancelPurchase()
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const handleStatusChange = useCallback((value: PurchaseStatus | 'all') => {
    setParams((prev) => ({ ...prev, status: value, page: 1 }))
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }))
  }, [])

  async function handleCancel(id: string) {
    if (!window.confirm('Cancel this purchase?')) return
    setCancellingId(id)
    try {
      await cancel(id)
      refetch()
    } catch {
      alert('Failed to cancel. Please try again.')
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div className="purchases-page">
      <header className="purchases-page__header">
        <h1>Purchases</h1>
        <div className="purchases-page__controls">
          <label className="status-filter">
            <span className="sr-only">Filter by status</span>
            <select
              value={params.status ?? 'all'}
              onChange={(e) => handleStatusChange(e.target.value as PurchaseStatus | 'all')}
            >
              {STATUS_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <main>
        {status === 'loading' && (
          <div role="status" aria-label="Loading purchases">
            <p>Loading purchases...</p>
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
              <p className="no-results">No purchases found.</p>
            ) : (
              <>
                <p className="purchases-page__count">
                  Showing {data.data.length} of {data.total} purchases
                </p>
                <div className="purchases-list">
                  {data.data.map((purchase) => (
                    <div key={purchase.id} className="purchase-card">
                      <div className="purchase-card__main">
                        <div className="purchase-card__info">
                          <p className="purchase-card__name">{purchase.productName}</p>
                          <p className="purchase-card__vendor">{purchase.vendor}</p>
                          <p className="purchase-card__desc">{purchase.description}</p>
                        </div>
                        <div className="purchase-card__right">
                          <p className="purchase-card__amount">
                            {formatAmount(purchase.amount, purchase.currency)}
                          </p>
                          <p className="purchase-card__date">{formatDate(purchase.purchasedAt)}</p>
                          <span className={STATUS_CLASSES[purchase.status]}>
                            {purchase.status}
                          </span>
                        </div>
                      </div>
                      {purchase.status === 'pending' && (
                        <div className="purchase-card__actions">
                          <button
                            className="btn btn--danger btn--sm"
                            onClick={() => handleCancel(purchase.id)}
                            disabled={cancelStatus === 'loading' && cancellingId === purchase.id}
                          >
                            {cancelStatus === 'loading' && cancellingId === purchase.id
                              ? 'Cancelling…'
                              : 'Cancel purchase'}
                          </button>
                        </div>
                      )}
                    </div>
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

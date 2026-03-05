import { http, HttpResponse, delay } from 'msw'
import { purchases as fixturePurchases } from '../fixtures/purchases'
import type { Purchase, PurchaseStatus } from '@/services/purchases/types'

let db: Purchase[] = [...fixturePurchases]

export function resetPurchasesDb() {
  db = [...fixturePurchases]
}

export function seedPurchasesDb(data: Purchase[]) {
  db = [...data]
}

export const purchasesHandlers = [
  http.get('/api/purchases', async ({ request }) => {
    await delay(100)

    const url = new URL(request.url)
    const page    = Number(url.searchParams.get('page')    || '1')
    const perPage = Number(url.searchParams.get('perPage') || '10')
    const status  = url.searchParams.get('status') || 'all'

    let result = [...db]
    if (status !== 'all') {
      result = result.filter((p) => p.status === status)
    }

    const total = result.length
    const start = (page - 1) * perPage
    const data  = result.slice(start, start + perPage)

    return HttpResponse.json({ data, total, page, perPage, totalPages: Math.ceil(total / perPage) })
  }),

  http.get('/api/purchases/:id', async ({ params }) => {
    await delay(50)
    const purchase = db.find((p) => p.id === params.id)
    if (!purchase) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(purchase)
  }),

  http.patch('/api/purchases/:id', async ({ params, request }) => {
    await delay(100)
    const index = db.findIndex((p) => p.id === params.id)
    if (index === -1) return new HttpResponse(null, { status: 404 })

    const body = await request.json() as { status?: PurchaseStatus }
    db[index] = { ...db[index], ...body }
    return HttpResponse.json(db[index])
  }),
]

import { http, HttpResponse, delay } from 'msw'
import { profile as fixtureProfile } from '../fixtures/profile'
import type { Profile } from '@/services/profile/types'

let db: Profile = { ...fixtureProfile }

export function resetProfileDb() {
  db = { ...fixtureProfile }
}

export function seedProfileDb(data: Profile) {
  db = { ...data }
}

export const profileHandlers = [
  http.get('/api/profile', async () => {
    await delay(50)
    return HttpResponse.json(db)
  }),

  http.put('/api/profile', async ({ request }) => {
    await delay(100)
    const body = await request.json()
    db = { ...db, ...(body as Partial<Profile>) }
    return HttpResponse.json(db)
  }),

  http.delete('/api/profile', async () => {
    await delay(100)
    return new HttpResponse(null, { status: 204 })
  }),
]

/**
 * Service client registry.
 *
 * Every backend service has one entry here.  The base URL defaults to /api
 * for local dev (intercepted by MSW) and is overridden by per-service env
 * vars in real environments:
 *
 *   VITE_USERS_API_URL     = https://users.internal.acme.com
 *   VITE_PROFILE_API_URL   = https://profile.internal.acme.com
 *   VITE_PURCHASES_API_URL = https://purchases.internal.acme.com
 *   ...
 *
 * Pattern for 100+ services: add one line per service. The shared
 * createApiClient() factory gives every service consistent error handling,
 * serialisation, and default headers without duplication.
 */
import { createApiClient } from '@/lib/api-client'

function service(envKey: string, fallback = '/api') {
  return createApiClient({
    baseUrl: (import.meta.env[envKey] as string | undefined) ?? fallback,
  })
}

export const usersClient    = service('VITE_USERS_API_URL')
export const profileClient  = service('VITE_PROFILE_API_URL')
export const purchasesClient = service('VITE_PURCHASES_API_URL')

// Future services — one line each:
// export const notificationsClient = service('VITE_NOTIFICATIONS_API_URL')
// export const analyticsClient      = service('VITE_ANALYTICS_API_URL')
// export const billingClient        = service('VITE_BILLING_API_URL')

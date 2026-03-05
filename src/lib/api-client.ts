/**
 * API client factory.
 *
 * Each backend service gets its own client instance via createApiClient(),
 * configured with the service's base URL and any default headers (e.g. auth).
 *
 * Pattern for 100+ services:
 *   const usersClient  = createApiClient({ baseUrl: env.VITE_USERS_API_URL })
 *   const billingClient = createApiClient({ baseUrl: env.VITE_BILLING_API_URL })
 *
 * All services share the same error-handling contract (HttpError), request
 * serialisation, and can be extended with interceptors in one place.
 */
import { HttpError } from './http-error'

export interface ApiClientConfig {
  baseUrl: string
  defaultHeaders?: Record<string, string>
}

type QueryParams = Record<string, string | number | boolean | undefined>

function buildUrl(base: string, path: string, params?: QueryParams): string {
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = `${normalizedBase}${normalizedPath}`

  if (!params) return url

  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') qs.set(k, String(v))
  }
  const str = qs.toString()
  return str ? `${url}?${str}` : url
}

async function parseResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text().catch(() => res.statusText)
    throw new HttpError(res.status, res.statusText, body)
  }
  const text = await res.text()
  return text ? (JSON.parse(text) as T) : (undefined as T)
}

export function createApiClient({ baseUrl, defaultHeaders = {} }: ApiClientConfig) {
  async function request<T>(
    method: string,
    path: string,
    options: { body?: unknown; params?: QueryParams } = {},
  ): Promise<T> {
    const { body, params } = options
    const res = await fetch(buildUrl(baseUrl, path, params), {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...defaultHeaders,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    return parseResponse<T>(res)
  }

  return {
    get:    <T>(path: string, params?: QueryParams) => request<T>('GET', path, { params }),
    post:   <T>(path: string, body?: unknown)       => request<T>('POST', path, { body }),
    put:    <T>(path: string, body?: unknown)        => request<T>('PUT', path, { body }),
    patch:  <T>(path: string, body?: unknown)        => request<T>('PATCH', path, { body }),
    delete: <T = void>(path: string)                 => request<T>('DELETE', path),
  }
}

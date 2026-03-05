/**
 * Typed HTTP error with status code.
 *
 * Thrown by the API client for any non-2xx response.
 * Consumers can check `err instanceof HttpError` and inspect `err.status`
 * to branch on 401 (redirect to login), 404 (not found UI), etc.
 */
export class HttpError extends Error {
  readonly status: number
  readonly statusText: string

  constructor(status: number, statusText: string, message?: string) {
    super(message ?? `HTTP ${status}: ${statusText}`)
    this.name = 'HttpError'
    this.status = status
    this.statusText = statusText
  }
}

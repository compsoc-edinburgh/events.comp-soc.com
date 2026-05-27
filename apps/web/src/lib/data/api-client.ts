import axios from 'redaxios'
import { auth } from '@clerk/tanstack-react-start/server'

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface ApiRequestOptions {
  /** HTTP method. Defaults to `'GET'`. */
  method?: Method
  /** Query-string params. `undefined` keys are dropped. */
  params?: Record<string, string | number | boolean | undefined>
  /** Request body — sent as JSON. */
  body?: unknown
  /**
   * Error message used when the request throws.
   * The real cause is still logged via `console.error`.
   */
  errorMessage?: string
}

interface ApiResponse<T> {
  data: T
  status: number
}

/**
 * Server-only helper used inside `createServerFn` handlers.
 *
 * - Reads `API_BASE_URL` (throws if missing).
 * - Pulls the Clerk session token and attaches `Authorization: Bearer …`.
 * - Wraps redaxios with a consistent error message + log.
 *
 * Use this instead of hand-rolling axios calls in every server fn.
 */
export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const baseUrl = process.env.API_BASE_URL
  if (!baseUrl) {
    throw new Error('API_BASE_URL is not defined')
  }

  const authObj = await auth()
  const token = await authObj.getToken()

  const { method = 'GET', params, body, errorMessage } = options

  // Strip undefined keys — redaxios serialises them as `key=undefined`.
  const cleanParams =
    params != null
      ? Object.fromEntries(
          Object.entries(params).filter(([, v]) => v !== undefined),
        )
      : undefined

  try {
    const res = await axios<T>(`${baseUrl}${path}`, {
      method,
      params: cleanParams,
      data: body,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(body != null ? { 'Content-Type': 'application/json' } : {}),
      },
    })

    return { data: res.data, status: res.status }
  } catch (err) {
    const status =
      typeof err === 'object' &&
      err !== null &&
      'response' in err &&
      typeof (err as { response?: { status?: unknown } }).response?.status ===
        'number'
        ? (err as { response: { status: number } }).response.status
        : 'unknown'
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error(`API request failed (status: ${status}): ${message}`)
    throw new Error(errorMessage ?? 'API request failed')
  }
}

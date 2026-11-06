import { isAxiosError } from "axios"

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string
  ) {
    super(message)
    this.name = "ApiError"
  }
}

/**
 * Functions reply with `{ error: message }`; Nhost Auth replies with
 * `{ message, error: code }`.
 */
export function toApiError(error: unknown, fallback = "The request failed"): ApiError {
  if (error instanceof ApiError) return error
  if (!isAxiosError(error)) return new ApiError(500, fallback)

  const status = error.response?.status ?? 503
  if (!error.response || status >= 500) {
    return new ApiError(status, "The service is unavailable. Try again shortly.")
  }
  const body = error.response.data as { error?: unknown; message?: unknown } | undefined
  const message =
    typeof body?.message === "string"
      ? body.message
      : typeof body?.error === "string"
        ? body.error
        : fallback
  const code =
    typeof body?.message === "string" && typeof body?.error === "string"
      ? body.error
      : undefined
  return new ApiError(status, message, code)
}

export function errorMessage(error: unknown, fallback = "Something went wrong") {
  return error instanceof ApiError ? error.message : fallback
}

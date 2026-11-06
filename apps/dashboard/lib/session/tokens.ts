import "server-only"
import { cookies } from "next/headers"
import { refreshSession, type NhostSession } from "../api/auth"
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  sessionCookieOptions,
  sessionCookies,
} from "./constants"

export async function readAccessToken() {
  return (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value ?? null
}

export async function storeSession(session: NhostSession) {
  const store = await cookies()
  for (const cookie of sessionCookies(session)) {
    store.set(cookie.name, cookie.value, cookie.options)
  }
}

export async function clearSession() {
  const store = await cookies()
  store.delete(ACCESS_TOKEN_COOKIE)
  store.delete(REFRESH_TOKEN_COOKIE)
}

/** Cookies are writable in server actions and route handlers, not while rendering. */
async function canWriteCookies() {
  const store = await cookies()
  const current = store.get(REFRESH_TOKEN_COOKIE)
  if (!current) return false
  try {
    store.set(current.name, current.value, sessionCookieOptions(60 * 60 * 24 * 30))
    return true
  } catch {
    return false
  }
}

/**
 * Nhost rotates refresh tokens, so a refresh is only safe when the new pair
 * can be saved. During rendering the middleware refreshes instead.
 */
export async function refreshAccessToken(): Promise<string | null> {
  if (!(await canWriteCookies())) return null
  const refreshToken = (await cookies()).get(REFRESH_TOKEN_COOKIE)?.value
  if (!refreshToken) return null
  try {
    const session = await refreshSession(refreshToken)
    await storeSession(session)
    return session.accessToken
  } catch {
    return null
  }
}

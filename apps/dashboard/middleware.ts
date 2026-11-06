import { NextResponse, type NextRequest } from "next/server"
import { decodeJwt } from "jose"
import { refreshSession, type NhostSession } from "./lib/api/auth"
import { isMockMode } from "./lib/config"
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  sessionCookies,
} from "./lib/session/constants"

export const config = {
  runtime: "nodejs",
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp)$).*)"],
}

const REFRESH_WINDOW_SECONDS = 60

/**
 * Parallel requests share one refresh, because Nhost invalidates a refresh
 * token as soon as it is used.
 */
const inflight = new Map<string, Promise<NhostSession>>()

function refreshOnce(refreshToken: string) {
  let pending = inflight.get(refreshToken)
  if (!pending) {
    pending = refreshSession(refreshToken)
    inflight.set(refreshToken, pending)
    pending.finally(() => setTimeout(() => inflight.delete(refreshToken), 10_000)).catch(() => {})
  }
  return pending
}

function expiresSoon(accessToken: string | undefined) {
  if (!accessToken) return true
  try {
    const { exp } = decodeJwt(accessToken)
    return !exp || exp - Date.now() / 1000 < REFRESH_WINDOW_SECONDS
  } catch {
    return true
  }
}

export async function middleware(request: NextRequest) {
  if (isMockMode()) return NextResponse.next()

  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value
  if (!refreshToken || !expiresSoon(accessToken)) return NextResponse.next()

  let session: NhostSession
  try {
    session = await refreshOnce(refreshToken)
  } catch {
    return NextResponse.next()
  }

  const cookies = sessionCookies(session)
  for (const cookie of cookies) request.cookies.set(cookie.name, cookie.value)
  const response = NextResponse.next({ request: { headers: request.headers } })
  for (const cookie of cookies) response.cookies.set(cookie.name, cookie.value, cookie.options)
  return response
}

import axios from "axios"
import { nhostConfig } from "../config"
import { ApiError, toApiError } from "./errors"

export interface NhostSession {
  accessToken: string
  accessTokenExpiresIn: number
  refreshToken: string
}

let client: ReturnType<typeof axios.create> | null = null

function authClient() {
  client ??= axios.create({
    baseURL: nhostConfig.authUrl,
    timeout: 10_000,
    headers: { "Content-Type": "application/json" },
  })
  return client
}

function toSession(raw: Partial<NhostSession> | null | undefined): NhostSession {
  if (!raw?.accessToken || !raw.refreshToken) {
    throw new ApiError(401, "Sign-in did not return a session")
  }
  return {
    accessToken: raw.accessToken,
    accessTokenExpiresIn: raw.accessTokenExpiresIn ?? 900,
    refreshToken: raw.refreshToken,
  }
}

export async function signInWithPassword(email: string, password: string) {
  try {
    const { data } = await authClient().post<{ session: NhostSession | null; mfa: unknown }>(
      "/signin/email-password",
      { email, password }
    )
    if (!data.session && data.mfa) {
      throw new ApiError(401, "Multi-factor sign-in is not supported here")
    }
    return toSession(data.session)
  } catch (error) {
    const apiError = toApiError(error, "Sign-in failed")
    if (apiError.code === "disabled-user") {
      throw new ApiError(403, "This account is suspended. Contact your platform admin.")
    }
    if (apiError.status === 401 || apiError.status === 400) {
      throw new ApiError(401, "Incorrect email or password")
    }
    throw apiError
  }
}

export async function refreshSession(refreshToken: string) {
  try {
    const { data } = await authClient().post<NhostSession>("/token", { refreshToken })
    return toSession(data)
  } catch (error) {
    throw toApiError(error, "Your session has expired")
  }
}

export async function revokeSession(refreshToken: string) {
  try {
    await authClient().post("/signout", { refreshToken })
  } catch {
    // The cookies are cleared either way; an already-invalid token is fine.
  }
}

export async function requestPasswordReset(email: string, redirectTo: string) {
  try {
    await authClient().post("/user/password/reset", { email, options: { redirectTo } })
  } catch (error) {
    const apiError = toApiError(error, "Could not send the reset email")
    if (apiError.status >= 500) throw apiError
  }
}

export async function setPassword(accessToken: string, newPassword: string) {
  try {
    await authClient().post(
      "/user/password",
      { newPassword },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
  } catch (error) {
    throw toApiError(error, "Could not update the password")
  }
}

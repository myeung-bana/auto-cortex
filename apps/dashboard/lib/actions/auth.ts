"use server"

import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import {
  refreshSession,
  requestPasswordReset,
  revokeSession,
  setPassword,
  signInWithPassword,
  type NhostSession,
} from "../api/auth"
import { errorMessage } from "../api/errors"
import {
  homeForRole,
  roleFromSession,
  roleMatchesPortal,
  wrongPortalMessage,
  type AuthPortal,
} from "../auth/portal"
import { isMockMode } from "../config"
import { ROUTES } from "../constants/routes"
import { MASTER_SESSION_COOKIE, SUPER_ADMIN } from "../master/session"
import { REFRESH_TOKEN_COOKIE } from "../session/constants"
import { SESSION_COOKIE, getUserById } from "../session/mock-session"
import { clearSession, storeSession } from "../session/tokens"

export interface FormState {
  error?: string
  message?: string
  email?: string
  /** Replacement reset token after Nhost rotates the one in the email link. */
  ticket?: string
}

function portalFrom(formData: FormData): AuthPortal {
  return formData.get("portal") === "master" ? "master" : "workspace"
}

async function appOrigin() {
  const list = await headers()
  const host = list.get("x-forwarded-host") ?? list.get("host") ?? "localhost:3000"
  const proto = list.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https")
  return `${proto}://${host}`
}

const credentials = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
})

/**
 * Signs in against Nhost Auth, then admits the session only when the JWT role
 * matches the portal that submitted the form (workspace vs Master Console).
 */
export async function signInWithPasswordAction(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  const portal = portalFrom(formData)
  const email = String(formData.get("email") ?? "")
  const parsed = credentials.safeParse({ email, password: formData.get("password") })
  if (!parsed.success) return { error: parsed.error.issues[0].message, email }

  let session: NhostSession
  try {
    session = await signInWithPassword(parsed.data.email, parsed.data.password)
  } catch (error) {
    return { error: errorMessage(error, "Sign-in failed"), email }
  }

  const role = roleFromSession(session)
  if (!role || !roleMatchesPortal(role, portal)) {
    await revokeSession(session.refreshToken).catch(() => {})
    return { error: wrongPortalMessage(portal), email }
  }

  await storeSession(session)
  redirect(homeForRole(role))
}

export async function requestPasswordResetAction(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  const email = z.string().trim().email().safeParse(formData.get("email"))
  if (!email.success) return { error: "Enter a valid email" }
  try {
    await requestPasswordReset(email.data, `${await appOrigin()}/reset-password`)
  } catch (error) {
    return { error: errorMessage(error, "Could not send the reset email") }
  }
  return { message: "If an account exists for that email, a reset link is on its way." }
}

const newPassword = z
  .object({
    ticket: z.string().min(1, "This reset link is invalid. Request a new one."),
    password: z.string().min(9, "Use at least 9 characters"),
    confirm: z.string(),
  })
  .refine((value) => value.password === value.confirm, {
    message: "Passwords do not match",
  })

export async function setPasswordAction(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = newPassword.safeParse({
    ticket: formData.get("ticket"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  let session: NhostSession
  try {
    session = await refreshSession(parsed.data.ticket)
  } catch {
    return { error: "This reset link has expired. Request a new one." }
  }
  try {
    await setPassword(session.accessToken, parsed.data.password)
  } catch (error) {
    return {
      error: errorMessage(error, "Could not update the password"),
      ticket: session.refreshToken,
    }
  }

  const role = roleFromSession(session)
  if (!role) {
    await revokeSession(session.refreshToken).catch(() => {})
    return { error: "Could not determine account type after reset." }
  }
  await storeSession(session)
  redirect(homeForRole(role))
}

async function endSession() {
  const refreshToken = (await cookies()).get(REFRESH_TOKEN_COOKIE)?.value
  if (refreshToken) await revokeSession(refreshToken)
  await clearSession()
}

export async function signOut() {
  if (isMockMode()) {
    ;(await cookies()).delete(SESSION_COOKIE)
  } else {
    await endSession()
  }
  redirect(ROUTES.login)
}

export async function signOutMaster() {
  if (isMockMode()) {
    ;(await cookies()).delete(MASTER_SESSION_COOKIE)
  } else {
    await endSession()
  }
  redirect(ROUTES.masterLogin)
}

// Prototype-only sign-in. These do nothing when the Nhost backend is enabled.

function setMockUser(cookieStore: Awaited<ReturnType<typeof cookies>>, userId: string) {
  cookieStore.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function signInMaster() {
  if (!isMockMode()) redirect(ROUTES.masterLogin)
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  cookieStore.set(MASTER_SESSION_COOKIE, SUPER_ADMIN.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  })
  redirect(ROUTES.masterConsole)
}

export async function signIn(userId: string) {
  if (!isMockMode() || !getUserById(userId)) {
    redirect(`${ROUTES.login}?error=invalid`)
  }
  const cookieStore = await cookies()
  cookieStore.delete(MASTER_SESSION_COOKIE)
  setMockUser(cookieStore, userId)
  redirect(ROUTES.dashboard)
}

export async function switchBusinessSpace(userId: string) {
  if (!isMockMode() || !getUserById(userId)) redirect(ROUTES.dashboard)
  setMockUser(await cookies(), userId)
  redirect(ROUTES.dashboard)
}

export type { AuthPortal }

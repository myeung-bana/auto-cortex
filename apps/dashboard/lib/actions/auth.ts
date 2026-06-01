"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ROUTES } from "../constants/routes"
import { SESSION_COOKIE, getUserById } from "../session/mock-session"

export async function signIn(userId: string) {
  const user = getUserById(userId)
  if (!user) {
    redirect(`${ROUTES.login}?error=invalid`)
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  redirect(ROUTES.dashboard)
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect(ROUTES.login)
}

export async function switchBusinessSpace(userId: string) {
  const user = getUserById(userId)
  if (!user) {
    redirect(ROUTES.dashboard)
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  redirect(ROUTES.dashboard)
}

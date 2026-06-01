import { cookies } from "next/headers"
import { USERS } from "../mock/fixtures/users"
import type { User } from "@autocore/utils"

export const SESSION_COOKIE = "autocore-mock-session"

export function getUserById(userId: string): User | null {
  return USERS.find((u) => u.id === userId && u.isActive) ?? null
}

export async function getSessionUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const userId = cookieStore.get(SESSION_COOKIE)?.value
  if (!userId) return null
  return getUserById(userId)
}

export function getSessionUserSync(userId: string | undefined): User | null {
  if (!userId) return null
  return getUserById(userId)
}

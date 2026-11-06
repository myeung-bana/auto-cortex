import { cookies } from "next/headers"
import { getMemoryStore } from "../data/memory-store"
import type { User } from "@autocore/utils"

export const SESSION_COOKIE = "autocore-mock-session"

export function getUserById(userId: string): User | null {
  const store = getMemoryStore()
  const user = store.users.find((u) => u.id === userId && u.isActive)
  if (!user) return null
  const space = store.businessSpaces.find((s) => s.id === user.businessSpaceId)
  return space?.isActive ? user : null
}

export function getLoginOptions() {
  const store = getMemoryStore()
  return store.users.flatMap((user) => {
    if (!user.isActive) return []
    const space = store.businessSpaces.find(
      (s) => s.id === user.businessSpaceId
    )
    if (!space?.isActive) return []
    const role = user.role === "BUSINESS_OWNER" ? "Owner" : "Staff"
    return [{ id: user.id, label: `${user.displayName} — ${space.name} (${role})` }]
  })
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

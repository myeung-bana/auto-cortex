import { cookies } from "next/headers"

export const MASTER_SESSION_COOKIE = "autocore-master-session"

export const SUPER_ADMIN = {
  id: "platform-super-admin",
  displayName: "Platform Super Admin",
  email: "admin@autocore.io",
}

export async function getMasterSession() {
  const cookieStore = await cookies()
  const id = cookieStore.get(MASTER_SESSION_COOKIE)?.value
  return id === SUPER_ADMIN.id ? SUPER_ADMIN : null
}

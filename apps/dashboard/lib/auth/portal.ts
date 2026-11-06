import { decodeJwt } from "jose"
import type { NhostSession } from "../api/auth"
import { ROUTES } from "../constants/routes"
import type { SessionRole } from "../session"

/** Which product surface the sign-in form belongs to. */
export type AuthPortal = "workspace" | "master"

export function roleFromAccessToken(accessToken: string): SessionRole | null {
  try {
    const claims = decodeJwt(accessToken)["https://hasura.io/jwt/claims"] as
      | Record<string, unknown>
      | undefined
    const role = claims?.["x-hasura-default-role"]
    if (role === "user" || role === "business_owner" || role === "superadmin") return role
    return null
  } catch {
    return null
  }
}

export function roleFromSession(session: NhostSession): SessionRole | null {
  return roleFromAccessToken(session.accessToken)
}

export function homeForRole(role: SessionRole) {
  return role === "superadmin" ? ROUTES.masterConsole : ROUTES.dashboard
}

export function loginForPortal(portal: AuthPortal) {
  return portal === "master" ? ROUTES.masterLogin : ROUTES.login
}

/** True when this JWT role may enter the given portal. */
export function roleMatchesPortal(role: SessionRole, portal: AuthPortal) {
  return portal === "master" ? role === "superadmin" : role !== "superadmin"
}

export function wrongPortalMessage(portal: AuthPortal) {
  return portal === "master"
    ? "This sign-in is for platform admins. Use the Business Space login."
    : "Platform admins sign in at the Master Console."
}

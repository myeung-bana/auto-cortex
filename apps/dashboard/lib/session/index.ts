import "server-only"
import { cache } from "react"
import { createRemoteJWKSet, jwtVerify } from "jose"
import type { User } from "@autocore/utils"
import { platformApi } from "../api/platform"
import { workspaceApi } from "../api/workspace"
import { isMockMode, nhostConfig } from "../config"
import { getMasterSession as getMockMasterSession } from "../master/session"
import type { MasterSession } from "../master/types"
import { getSessionUser as getMockSessionUser } from "./mock-session"
import { readAccessToken } from "./tokens"

export type SessionRole = "user" | "business_owner" | "superadmin"

export interface SessionClaims {
  userId: string
  role: SessionRole
}

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null

function authKeys() {
  jwks ??= createRemoteJWKSet(new URL(`${nhostConfig.authUrl}/.well-known/jwks.json`))
  return jwks
}

/** Verified claims from the access token cookie, or null when signed out. */
export const getSessionClaims = cache(async (): Promise<SessionClaims | null> => {
  if (isMockMode()) return null
  const token = await readAccessToken()
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, authKeys())
    const claims = payload["https://hasura.io/jwt/claims"] as Record<string, unknown> | undefined
    const userId = claims?.["x-hasura-user-id"]
    const role = claims?.["x-hasura-default-role"]
    if (typeof userId !== "string") return null
    if (role !== "user" && role !== "business_owner" && role !== "superadmin") return null
    return { userId, role }
  } catch {
    return null
  }
})

export const getSessionUser = cache(async (): Promise<User | null> => {
  if (isMockMode()) return getMockSessionUser()
  const claims = await getSessionClaims()
  if (!claims || claims.role === "superadmin") return null
  try {
    const { space, me } = await workspaceApi.space.get()
    if (!space?.isActive || !me?.isActive) return null
    return me
  } catch {
    return null
  }
})

export const getMasterSession = cache(async (): Promise<MasterSession | null> => {
  if (isMockMode()) return getMockMasterSession()
  const claims = await getSessionClaims()
  if (claims?.role !== "superadmin") return null
  try {
    return await platformApi.me()
  } catch {
    return null
  }
})

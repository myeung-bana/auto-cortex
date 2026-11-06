export const ACCESS_TOKEN_COOKIE = "autocore-access-token"
export const REFRESH_TOKEN_COOKIE = "autocore-refresh-token"

const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30

export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  }
}

export function sessionCookies(session: {
  accessToken: string
  accessTokenExpiresIn: number
  refreshToken: string
}) {
  return [
    {
      name: ACCESS_TOKEN_COOKIE,
      value: session.accessToken,
      options: sessionCookieOptions(session.accessTokenExpiresIn),
    },
    {
      name: REFRESH_TOKEN_COOKIE,
      value: session.refreshToken,
      options: sessionCookieOptions(REFRESH_TOKEN_MAX_AGE),
    },
  ]
}

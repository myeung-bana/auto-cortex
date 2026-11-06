export function isMockMode() {
  return process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true"
}

function required(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(
      `${name} is not set. Set it, or set NEXT_PUBLIC_USE_MOCK_DATA=true for prototype mode.`
    )
  }
  return value.replace(/\/$/, "")
}

export const nhostConfig = {
  get authUrl() {
    return required("NEXT_PUBLIC_NHOST_AUTH_URL", process.env.NEXT_PUBLIC_NHOST_AUTH_URL)
  },
  get functionsUrl() {
    return required(
      "NEXT_PUBLIC_NHOST_FUNCTIONS_URL",
      process.env.NEXT_PUBLIC_NHOST_FUNCTIONS_URL
    )
  },
}

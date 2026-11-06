import "server-only"
import axios, { type InternalAxiosRequestConfig } from "axios"
import { nhostConfig } from "../config"
import { readAccessToken, refreshAccessToken } from "../session/tokens"
import { toApiError } from "./errors"

type RetriableConfig = InternalAxiosRequestConfig & { retried?: boolean }

let client: ReturnType<typeof axios.create> | null = null

function functionsClient() {
  if (client) return client
  client = axios.create({
    baseURL: nhostConfig.functionsUrl,
    timeout: 15_000,
    headers: { "Content-Type": "application/json" },
  })

  client.interceptors.request.use(async (config) => {
    if (!config.headers.Authorization) {
      const token = await readAccessToken()
      if (token) config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  client.interceptors.response.use(undefined, async (error) => {
    const config = error.config as RetriableConfig | undefined
    if (error.response?.status === 401 && config && !config.retried) {
      config.retried = true
      const token = await refreshAccessToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        return functionsClient().request(config)
      }
    }
    throw toApiError(error)
  })
  return client
}

/** Calls one Nhost function action as the signed-in user. */
export async function callFunction<T>(
  name: string,
  action: string,
  payload: Record<string, unknown> = {}
): Promise<T> {
  const { data } = await functionsClient().post<{ data: T }>(`/${name}`, {
    ...payload,
    action,
  })
  return data.data
}

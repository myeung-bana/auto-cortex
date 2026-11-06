import "server-only"
import { isMockMode } from "../config"
import { mockProvider } from "./mock-provider"
import { nhostProvider } from "./nhost-provider"
import type { DataProvider } from "./types"

export function getDataProvider(): DataProvider {
  return isMockMode() ? mockProvider : nhostProvider
}

export type { DataProvider, DashboardStats, ClientFilters, ListingFilters } from "./types"

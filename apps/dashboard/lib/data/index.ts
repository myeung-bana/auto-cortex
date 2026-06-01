import { mockProvider } from "./mock-provider"
import type { DataProvider } from "./types"

export function getDataProvider(): DataProvider {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
    return mockProvider
  }
  throw new Error(
    "GraphQL provider not configured. Set NEXT_PUBLIC_USE_MOCK_DATA=true for prototype mode."
  )
}

export type { DataProvider, DashboardStats, ClientFilters, ListingFilters } from "./types"

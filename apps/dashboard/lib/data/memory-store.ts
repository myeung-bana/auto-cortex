import type { ActivityEvent, Listing } from "@autocore/utils"
import {
  ACTIVITY_EVENTS,
  BUSINESS_SPACES,
  CLIENTS,
  LISTINGS,
  USERS,
} from "../mock/seed"
import makesJson from "./makes.json"
import bodyTypesJson from "./body-types.json"
import transmissionsJson from "./transmissions.json"
import fuelTypesJson from "./fuel-types.json"
import exteriorColorsJson from "./exterior-colors.json"
import interiorColorsJson from "./interior-colors.json"
import featuresJson from "./features.json"
import engineSizesJson from "./engine-sizes.json"
import pricesJson from "./prices.json"
import {
  mapNamedTaxonomy,
  mapRangeTaxonomy,
} from "../taxonomies/map-records"
import type { TaxonomyKey, TaxonomyRecord } from "../taxonomies/types"
import type { PlatformEvent } from "../master/types"

function clone<T>(value: T): T {
  return structuredClone(value)
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export class MemoryStore {
  businessSpaces = clone(BUSINESS_SPACES)
  users = clone(USERS)
  clients = clone(CLIENTS)
  listings: Listing[] = clone(LISTINGS)
  activityEvents: ActivityEvent[] = clone(ACTIVITY_EVENTS)
  platformEvents: PlatformEvent[] = BUSINESS_SPACES.map((space) => ({
    id: `platform-${space.id}`,
    type: "SPACE_CREATED",
    businessSpaceId: space.id,
    description: `${space.name} was created`,
    createdAt: space.createdAt,
  }))
  taxonomies: Record<TaxonomyKey, TaxonomyRecord[]> = {
    makes: (makesJson as Parameters<typeof mapNamedTaxonomy>[0][]).map(
      mapNamedTaxonomy
    ),
    "body-types": (
      bodyTypesJson as Parameters<typeof mapNamedTaxonomy>[0][]
    ).map(mapNamedTaxonomy),
    transmissions: (
      transmissionsJson as Parameters<typeof mapNamedTaxonomy>[0][]
    ).map(mapNamedTaxonomy),
    "fuel-types": (
      fuelTypesJson as Parameters<typeof mapNamedTaxonomy>[0][]
    ).map(mapNamedTaxonomy),
    "exterior-colors": (
      exteriorColorsJson as Parameters<typeof mapNamedTaxonomy>[0][]
    ).map(mapNamedTaxonomy),
    "interior-colors": (
      interiorColorsJson as Parameters<typeof mapNamedTaxonomy>[0][]
    ).map(mapNamedTaxonomy),
    features: (featuresJson as Parameters<typeof mapNamedTaxonomy>[0][]).map(
      mapNamedTaxonomy
    ),
    "engine-sizes": (
      engineSizesJson as Parameters<typeof mapRangeTaxonomy>[0][]
    ).map(mapRangeTaxonomy),
    prices: (pricesJson as Parameters<typeof mapRangeTaxonomy>[0][]).map(
      mapRangeTaxonomy
    ),
  }
}

const globalStore = globalThis as typeof globalThis & {
  __autocoreMockStore?: MemoryStore
}

export function getMemoryStore(): MemoryStore {
  if (!globalStore.__autocoreMockStore) {
    globalStore.__autocoreMockStore = new MemoryStore()
  }
  return globalStore.__autocoreMockStore
}

export function countSeatsUsed(store: MemoryStore, businessSpaceId: string) {
  return store.users.filter(
    (user) => user.businessSpaceId === businessSpaceId && user.isActive
  ).length
}

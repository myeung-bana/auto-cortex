import type { Listing } from "@autocore/utils"
import { generateId, getMemoryStore } from "../data/memory-store"
import { getTaxonomyConfig } from "./registry"
import type {
  ListingOption,
  NamedTaxonomy,
  RangeTaxonomy,
  TaxonomyInput,
  TaxonomyKey,
  TaxonomyRecord,
} from "./types"

export type { ListingOption }

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function displayName(record: TaxonomyRecord): string {
  return record.kind === "named" ? record.name.en : record.label.en
}

export function listTaxonomy(key: TaxonomyKey): TaxonomyRecord[] {
  return [...getMemoryStore().taxonomies[key]].sort(
    (a, b) => a.sortOrder - b.sortOrder
  )
}

export function getTaxonomy(
  key: TaxonomyKey,
  id: string
): TaxonomyRecord | null {
  return getMemoryStore().taxonomies[key].find((item) => item.id === id) ?? null
}

export function activeOptions(key: TaxonomyKey): ListingOption[] {
  return listTaxonomy(key)
    .filter((item) => item.kind === "range" || item.isActive)
    .map((item) => ({
      slug: item.slug,
      label: displayName(item),
      hex: item.kind === "named" ? item.hex : undefined,
      category: item.kind === "named" ? item.category : undefined,
    }))
}

export function labelFor(key: TaxonomyKey, slug: string | null): string | null {
  if (!slug) return null
  const match = getMemoryStore().taxonomies[key].find((item) => item.slug === slug)
  return match ? displayName(match) : slug
}

export function countTaxonomyUsage(key: TaxonomyKey, slug: string): number {
  const config = getTaxonomyConfig(key)
  if (!config?.listingField) return 0
  const field = config.listingField
  return getMemoryStore().listings.filter((listing) => {
    if (listing.isArchived) return false
    if (field === "features") return listing.features.includes(slug)
    return listing[field] === slug
  }).length
}

function assertUniqueSlug(key: TaxonomyKey, slug: string, ignoreId?: string) {
  const clash = getMemoryStore().taxonomies[key].find(
    (item) => item.slug === slug && item.id !== ignoreId
  )
  if (clash) {
    throw new Error("A term with this slug already exists")
  }
}

export function createTaxonomy(
  key: TaxonomyKey,
  input: TaxonomyInput
): TaxonomyRecord {
  const config = getTaxonomyConfig(key)
  if (!config) throw new Error("Unknown taxonomy")
  const slug = slugify(input.slug || input.nameEn)
  if (!slug) throw new Error("Slug is required")
  assertUniqueSlug(key, slug)

  const record: TaxonomyRecord =
    config.kind === "named"
      ? ({
          id: generateId(key),
          kind: "named",
          businessSpaceId: null,
          slug,
          name: { en: input.nameEn, "zh-Hant": input.nameZh || undefined },
          sortOrder: input.sortOrder,
          isActive: input.isActive ?? true,
          country: input.country || undefined,
          logoUrl: input.logoUrl || undefined,
          icon: input.icon || undefined,
          hex: input.hex || undefined,
          isElectric: input.isElectric,
          requiresEngineSize: input.requiresEngineSize,
          category: input.category || undefined,
        } satisfies NamedTaxonomy)
      : ({
          id: generateId(key),
          kind: "range",
          slug,
          label: { en: input.nameEn, "zh-Hant": input.nameZh || undefined },
          sortOrder: input.sortOrder,
          currency: input.currency || undefined,
          min: input.min,
          max: input.max,
          unit: input.unit || undefined,
          minCc: input.minCc,
          maxCc: input.maxCc,
        } satisfies RangeTaxonomy)

  getMemoryStore().taxonomies[key].push(record)
  return record
}

export function updateTaxonomy(
  key: TaxonomyKey,
  id: string,
  input: TaxonomyInput
): TaxonomyRecord | null {
  const items = getMemoryStore().taxonomies[key]
  const index = items.findIndex((item) => item.id === id)
  if (index === -1) return null
  const slug = slugify(input.slug || input.nameEn)
  if (!slug) throw new Error("Slug is required")
  assertUniqueSlug(key, slug, id)
  const existing = items[index]

  if (existing.kind === "named") {
    items[index] = {
      ...existing,
      slug,
      name: { en: input.nameEn, "zh-Hant": input.nameZh || undefined },
      sortOrder: input.sortOrder,
      isActive: input.isActive ?? existing.isActive,
      country: input.country || undefined,
      logoUrl: input.logoUrl || undefined,
      icon: input.icon || undefined,
      hex: input.hex || undefined,
      isElectric: input.isElectric,
      requiresEngineSize: input.requiresEngineSize,
      category: input.category || undefined,
    }
  } else {
    items[index] = {
      ...existing,
      slug,
      label: { en: input.nameEn, "zh-Hant": input.nameZh || undefined },
      sortOrder: input.sortOrder,
      currency: input.currency || undefined,
      min: input.min,
      max: input.max,
      unit: input.unit || undefined,
      minCc: input.minCc,
      maxCc: input.maxCc,
    }
  }

  return items[index]
}

export function removeTaxonomy(
  key: TaxonomyKey,
  id: string
): "deleted" | "deactivated" | "missing" {
  const items = getMemoryStore().taxonomies[key]
  const record = items.find((item) => item.id === id)
  if (!record) return "missing"

  const usage = countTaxonomyUsage(key, record.slug)
  if (record.kind === "named" && usage > 0) {
    record.isActive = false
    return "deactivated"
  }

  const index = items.findIndex((item) => item.id === id)
  items.splice(index, 1)
  return "deleted"
}

export function getListingFormOptions() {
  return {
    makes: activeOptions("makes"),
    bodyTypes: activeOptions("body-types"),
    transmissions: activeOptions("transmissions"),
    fuelTypes: activeOptions("fuel-types"),
    exteriorColors: activeOptions("exterior-colors"),
    interiorColors: activeOptions("interior-colors"),
    features: activeOptions("features"),
  }
}

export function listingUsesSlug(listing: Listing, key: TaxonomyKey, slug: string) {
  const config = getTaxonomyConfig(key)
  if (!config?.listingField) return false
  if (config.listingField === "features") return listing.features.includes(slug)
  return listing[config.listingField] === slug
}

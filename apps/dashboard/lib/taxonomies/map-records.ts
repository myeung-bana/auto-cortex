import type { Listing, ListingStatus } from "@autocore/utils"
import type { LocalizedText, NamedTaxonomy, RangeTaxonomy } from "./types"

interface JsonName {
  en: string
  "zh-Hant"?: string
}

interface JsonNamed {
  id: string
  business_space_id?: string | null
  slug: string
  name: JsonName
  sort_order: number
  is_active: boolean
  country?: string
  logo_url?: string
  icon?: string
  hex?: string
  is_electric?: boolean
  requires_engine_size?: boolean
  category?: string
}

interface JsonRange {
  id: string
  slug: string
  label: JsonName
  sort_order: number
  currency?: string
  min?: number | null
  max?: number | null
  unit?: string
  min_cc?: number | null
  max_cc?: number | null
}

interface JsonListing {
  id: string
  business_space_id: string
  slug: string
  title: string
  make: string
  model: string
  variant?: string | null
  year: number
  body_type?: string | null
  transmission?: string | null
  fuel_type?: string | null
  exterior_color?: string | null
  interior_color?: string | null
  price?: { amount: number; currency: string } | null
  mileage?: { value: number; unit: string } | null
  engine_cc?: number | null
  seats?: number | null
  doors?: number | null
  features?: string[]
  images?: {
    position: number
    is_cover: boolean
    storage_file_id: string | null
    source_url: string
  }[]
  description?: string | null
  status: ListingStatus
  vin?: string | null
  client_id?: string | null
  is_archived: boolean
  created_at: string
  updated_at: string
}

function localized(value: JsonName): LocalizedText {
  return { en: value.en, "zh-Hant": value["zh-Hant"] }
}

export function mapNamedTaxonomy(raw: JsonNamed): NamedTaxonomy {
  return {
    id: raw.id,
    kind: "named",
    businessSpaceId: raw.business_space_id ?? null,
    slug: raw.slug,
    name: localized(raw.name),
    sortOrder: raw.sort_order,
    isActive: raw.is_active,
    country: raw.country,
    logoUrl: raw.logo_url,
    icon: raw.icon,
    hex: raw.hex,
    isElectric: raw.is_electric,
    requiresEngineSize: raw.requires_engine_size,
    category: raw.category,
  }
}

export function mapRangeTaxonomy(raw: JsonRange): RangeTaxonomy {
  return {
    id: raw.id,
    kind: "range",
    slug: raw.slug,
    label: localized(raw.label),
    sortOrder: raw.sort_order,
    currency: raw.currency,
    min: raw.min,
    max: raw.max,
    unit: raw.unit,
    minCc: raw.min_cc,
    maxCc: raw.max_cc,
  }
}

export function mapCatalogListing(
  raw: JsonListing,
  businessSpaceId: string
): Listing {
  return {
    id: raw.id,
    businessSpaceId,
    slug: raw.slug,
    title: raw.title,
    make: raw.make,
    model: raw.model,
    variant: raw.variant ?? null,
    year: raw.year,
    bodyType: raw.body_type ?? null,
    transmission: raw.transmission ?? null,
    fuelType: raw.fuel_type ?? null,
    exteriorColor: raw.exterior_color ?? null,
    interiorColor: raw.interior_color ?? null,
    price: raw.price ?? null,
    mileage: raw.mileage ?? null,
    engineCc: raw.engine_cc ?? null,
    seats: raw.seats ?? null,
    doors: raw.doors ?? null,
    features: raw.features ?? [],
    images: (raw.images ?? []).map((image) => ({
      position: image.position,
      isCover: image.is_cover,
      storageFileId: image.storage_file_id,
      sourceUrl: image.source_url,
    })),
    description: raw.description ?? null,
    status: raw.status,
    vin: raw.vin ?? null,
    clientId: raw.client_id ?? null,
    isArchived: raw.is_archived,
    createdById: null,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

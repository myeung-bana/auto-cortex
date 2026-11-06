export type TaxonomyKey =
  | "makes"
  | "body-types"
  | "transmissions"
  | "fuel-types"
  | "exterior-colors"
  | "interior-colors"
  | "features"
  | "engine-sizes"
  | "prices"

export interface LocalizedText {
  en: string
  "zh-Hant"?: string
}

export interface NamedTaxonomy {
  id: string
  kind: "named"
  businessSpaceId: string | null
  slug: string
  name: LocalizedText
  sortOrder: number
  isActive: boolean
  country?: string
  logoUrl?: string
  icon?: string
  hex?: string
  isElectric?: boolean
  requiresEngineSize?: boolean
  category?: string
}

export interface RangeTaxonomy {
  id: string
  kind: "range"
  businessSpaceId?: string | null
  slug: string
  label: LocalizedText
  sortOrder: number
  currency?: string
  min?: number | null
  max?: number | null
  unit?: string
  minCc?: number | null
  maxCc?: number | null
}

export type TaxonomyRecord = NamedTaxonomy | RangeTaxonomy

export interface ListingOption {
  slug: string
  label: string
  hex?: string
  category?: string
}

export interface TaxonomyInput {
  nameEn: string
  nameZh?: string
  slug: string
  sortOrder: number
  isActive?: boolean
  country?: string
  logoUrl?: string
  hex?: string
  icon?: string
  category?: string
  isElectric?: boolean
  requiresEngineSize?: boolean
  currency?: string
  min?: number | null
  max?: number | null
  unit?: string
  minCc?: number | null
  maxCc?: number | null
}

export type TaxonomyField =
  | "nameEn"
  | "nameZh"
  | "slug"
  | "sortOrder"
  | "isActive"
  | "country"
  | "logoUrl"
  | "hex"
  | "icon"
  | "category"
  | "isElectric"
  | "requiresEngineSize"
  | "currency"
  | "min"
  | "max"
  | "unit"
  | "minCc"
  | "maxCc"

export interface TaxonomyConfig {
  key: TaxonomyKey
  label: string
  description: string
  kind: "named" | "range"
  fields: TaxonomyField[]
  listingField?:
    | "make"
    | "bodyType"
    | "transmission"
    | "fuelType"
    | "exteriorColor"
    | "interiorColor"
    | "features"
}

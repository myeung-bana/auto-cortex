import type { TaxonomyConfig, TaxonomyKey } from "./types"

const namedCore: TaxonomyConfig["fields"] = [
  "nameEn",
  "nameZh",
  "slug",
  "sortOrder",
  "isActive",
]

export const TAXONOMY_CONFIGS: TaxonomyConfig[] = [
  {
    key: "makes",
    label: "Makes",
    description: "Vehicle manufacturers used on listings.",
    kind: "named",
    fields: [...namedCore, "country", "logoUrl"],
    listingField: "make",
  },
  {
    key: "body-types",
    label: "Body types",
    description: "Body styles such as sedan, SUV, and coupe.",
    kind: "named",
    fields: [...namedCore, "icon"],
    listingField: "bodyType",
  },
  {
    key: "transmissions",
    label: "Transmissions",
    description: "Gearbox options available on listings.",
    kind: "named",
    fields: namedCore,
    listingField: "transmission",
  },
  {
    key: "fuel-types",
    label: "Fuel types",
    description: "Fuel and powertrain options.",
    kind: "named",
    fields: [...namedCore, "isElectric", "requiresEngineSize"],
    listingField: "fuelType",
  },
  {
    key: "exterior-colors",
    label: "Exterior colours",
    description: "Paint colours shown on listings.",
    kind: "named",
    fields: [...namedCore, "hex"],
    listingField: "exteriorColor",
  },
  {
    key: "interior-colors",
    label: "Interior colours",
    description: "Cabin colours shown on listings.",
    kind: "named",
    fields: [...namedCore, "hex"],
    listingField: "interiorColor",
  },
  {
    key: "features",
    label: "Features",
    description: "Equipment grouped by safety, comfort, technology, and exterior.",
    kind: "named",
    fields: [...namedCore, "category", "icon"],
    listingField: "features",
  },
  {
    key: "engine-sizes",
    label: "Engine sizes",
    description: "Filter bands for engine capacity. Listings store a raw cc value.",
    kind: "range",
    fields: ["nameEn", "slug", "sortOrder", "unit", "minCc", "maxCc"],
  },
  {
    key: "prices",
    label: "Price bands",
    description: "Filter bands for asking price. Listings store a raw amount.",
    kind: "range",
    fields: ["nameEn", "slug", "sortOrder", "currency", "min", "max"],
  },
]

export function getTaxonomyConfig(key: string): TaxonomyConfig | null {
  return TAXONOMY_CONFIGS.find((config) => config.key === key) ?? null
}

export function isTaxonomyKey(key: string): key is TaxonomyKey {
  return TAXONOMY_CONFIGS.some((config) => config.key === key)
}

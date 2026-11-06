import "server-only"
import { workspaceApi } from "../api/workspace"
import { isMockMode } from "../config"
import * as store from "./store"
import type {
  ListingOption,
  TaxonomyInput,
  TaxonomyKey,
  TaxonomyRecord,
} from "./types"

export const displayName = store.displayName

export interface TaxonomyRow {
  record: TaxonomyRecord
  usage: number
  editable: boolean
}

export interface TaxonomyListing {
  rows: TaxonomyRow[]
  canManage: boolean
}

export type TaxonomyLabeler = (key: TaxonomyKey, slug: string | null) => string | null

function isShared(record: TaxonomyRecord) {
  return record.businessSpaceId == null
}

export async function listTaxonomyRows(key: TaxonomyKey): Promise<TaxonomyListing> {
  if (isMockMode()) {
    return {
      canManage: true,
      rows: store.listTaxonomy(key).map((record) => ({
        record,
        usage: store.countTaxonomyUsage(key, record.slug),
        editable: true,
      })),
    }
  }
  const { records, usage, canManage } = await workspaceApi.taxonomies.list(key)
  return {
    canManage,
    rows: records.map((record) => ({
      record,
      usage: usage[record.slug] ?? 0,
      editable: canManage && !isShared(record),
    })),
  }
}

export async function getTaxonomyRecord(key: TaxonomyKey, id: string) {
  if (isMockMode()) return store.getTaxonomy(key, id)
  return workspaceApi.taxonomies.get(key, id)
}

function toOptions(records: TaxonomyRecord[]): ListingOption[] {
  return [...records]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .filter((item) => item.kind === "range" || item.isActive)
    .map((item) => ({
      slug: item.slug,
      label: displayName(item),
      hex: item.kind === "named" ? item.hex : undefined,
      category: item.kind === "named" ? item.category : undefined,
    }))
}

async function catalog(keys: TaxonomyKey[]) {
  if (isMockMode()) {
    return Object.fromEntries(keys.map((key) => [key, store.listTaxonomy(key)])) as Partial<
      Record<TaxonomyKey, TaxonomyRecord[]>
    >
  }
  return workspaceApi.taxonomies.catalog(keys)
}

export async function getActiveOptions(key: TaxonomyKey) {
  return toOptions((await catalog([key]))[key] ?? [])
}

export async function getListingFormOptions() {
  const data = await catalog([
    "makes",
    "body-types",
    "transmissions",
    "fuel-types",
    "exterior-colors",
    "interior-colors",
    "features",
  ])
  return {
    makes: toOptions(data.makes ?? []),
    bodyTypes: toOptions(data["body-types"] ?? []),
    transmissions: toOptions(data.transmissions ?? []),
    fuelTypes: toOptions(data["fuel-types"] ?? []),
    exteriorColors: toOptions(data["exterior-colors"] ?? []),
    interiorColors: toOptions(data["interior-colors"] ?? []),
    features: toOptions(data.features ?? []),
  }
}

/** Loads the given taxonomies once and resolves slugs to display labels. */
export async function getTaxonomyLabeler(keys: TaxonomyKey[]): Promise<TaxonomyLabeler> {
  const data = await catalog(keys)
  return (key, slug) => {
    if (!slug) return null
    const match = data[key]?.find((item) => item.slug === slug)
    return match ? displayName(match) : slug
  }
}

export async function createTaxonomyRecord(key: TaxonomyKey, input: TaxonomyInput) {
  if (isMockMode()) return store.createTaxonomy(key, input)
  return workspaceApi.taxonomies.create(key, input)
}

export async function updateTaxonomyRecord(key: TaxonomyKey, id: string, input: TaxonomyInput) {
  if (isMockMode()) return store.updateTaxonomy(key, id, input)
  return workspaceApi.taxonomies.update(key, id, input)
}

export async function removeTaxonomyRecord(key: TaxonomyKey, id: string) {
  if (isMockMode()) return store.removeTaxonomy(key, id)
  return workspaceApi.taxonomies.remove(key, id)
}

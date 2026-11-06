import "server-only"
import { cache } from "react"
import type {
  ActivityEvent,
  BusinessSpace,
  Client,
  CreateClientInput,
  CreateListingInput,
  Listing,
  User,
} from "@autocore/utils"
import type {
  ClientFilters,
  DashboardStats,
  ListingFilters,
  ListingPatch,
} from "../data/types"
import type { TaxonomyInput, TaxonomyKey, TaxonomyRecord } from "../taxonomies/types"
import { callFunction } from "./http"

export const workspaceApi = {
  space: {
    /** Memoized per request: the session check, layout, and page all need it. */
    get: cache(() =>
      callFunction<{ space: BusinessSpace | null; me: User | null }>("workspace-space", "get")
    ),
  },

  dashboard: {
    stats: () => callFunction<DashboardStats>("workspace-dashboard", "stats"),
    activity: (limit = 10) =>
      callFunction<ActivityEvent[]>("workspace-dashboard", "activity", { limit }),
  },

  users: {
    list: () => callFunction<User[]>("workspace-users", "list"),
    invite: (input: { email: string; displayName: string }) =>
      callFunction<{ email: string; inviteSent: boolean }>("workspace-users", "invite", {
        input,
      }),
  },

  clients: {
    list: (filters: ClientFilters = {}) =>
      callFunction<Client[]>("workspace-clients", "list", { filters }),
    get: (id: string) => callFunction<Client | null>("workspace-clients", "get", { id }),
    create: (input: CreateClientInput) =>
      callFunction<Client>("workspace-clients", "create", { input }),
    update: (id: string, input: Partial<CreateClientInput>) =>
      callFunction<Client | null>("workspace-clients", "update", { id, input }),
    archive: (id: string) => callFunction<boolean>("workspace-clients", "archive", { id }),
  },

  listings: {
    list: (filters: ListingFilters = {}) =>
      callFunction<Listing[]>("workspace-listings", "list", { filters }),
    get: (id: string) => callFunction<Listing | null>("workspace-listings", "get", { id }),
    create: (input: CreateListingInput) =>
      callFunction<Listing>("workspace-listings", "create", { input }),
    update: (id: string, input: Partial<CreateListingInput>) =>
      callFunction<Listing | null>("workspace-listings", "update", { id, input }),
    patch: (id: string, patch: ListingPatch) =>
      callFunction<Listing | null>("workspace-listings", "patch", { id, patch }),
    archive: (id: string) => callFunction<boolean>("workspace-listings", "archive", { id }),
  },

  taxonomies: {
    list: (key: TaxonomyKey) =>
      callFunction<{
        records: TaxonomyRecord[]
        usage: Record<string, number>
        canManage: boolean
      }>("workspace-taxonomies", "list", { key }),
    catalog: (keys?: TaxonomyKey[]) =>
      callFunction<Partial<Record<TaxonomyKey, TaxonomyRecord[]>>>(
        "workspace-taxonomies",
        "catalog",
        { keys }
      ),
    get: (key: TaxonomyKey, id: string) =>
      callFunction<TaxonomyRecord | null>("workspace-taxonomies", "get", { key, id }),
    create: (key: TaxonomyKey, input: TaxonomyInput) =>
      callFunction<TaxonomyRecord>("workspace-taxonomies", "create", { key, input }),
    update: (key: TaxonomyKey, id: string, input: TaxonomyInput) =>
      callFunction<TaxonomyRecord | null>("workspace-taxonomies", "update", {
        key,
        id,
        input,
      }),
    remove: (key: TaxonomyKey, id: string) =>
      callFunction<"deleted" | "deactivated" | "missing">("workspace-taxonomies", "remove", {
        key,
        id,
      }),
  },
}

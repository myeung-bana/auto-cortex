import "server-only"
import { workspaceApi } from "../api/workspace"
import type { DataProvider } from "./types"

/**
 * The business space always comes from the caller's access token on the
 * server, so the `businessSpaceId` arguments are never sent.
 */
export const nhostProvider: DataProvider = {
  async getBusinessSpace() {
    return (await workspaceApi.space.get()).space
  },
  getUsers: () => workspaceApi.users.list(),

  getClients: (_space, filters) => workspaceApi.clients.list(filters),
  getClient: (_space, clientId) => workspaceApi.clients.get(clientId),
  createClient: (_space, _userId, input) => workspaceApi.clients.create(input),
  updateClient: (_space, clientId, input) => workspaceApi.clients.update(clientId, input),
  archiveClient: (_space, clientId) => workspaceApi.clients.archive(clientId),

  getListings: (_space, filters) => workspaceApi.listings.list(filters),
  getListing: (_space, listingId) => workspaceApi.listings.get(listingId),
  createListing: (_space, _userId, input) => workspaceApi.listings.create(input),
  updateListing: (_space, listingId, input) => workspaceApi.listings.update(listingId, input),
  patchListing: (_space, listingId, patch) => workspaceApi.listings.patch(listingId, patch),
  archiveListing: (_space, listingId) => workspaceApi.listings.archive(listingId),

  getActivityEvents: (_space, limit) => workspaceApi.dashboard.activity(limit),
  getDashboardStats: () => workspaceApi.dashboard.stats(),
}

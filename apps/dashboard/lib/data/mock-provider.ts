import type {
  ActivityEvent,
  BusinessSpace,
  Client,
  CreateClientInput,
  CreateListingInput,
  Listing,
  ListingStatus,
  User,
} from "@autocore/utils"
import {
  ACTIVITY_EVENTS,
  BUSINESS_SPACES,
  CLIENTS,
  LISTINGS,
  USERS,
} from "../mock/seed"
import type {
  ClientFilters,
  DashboardStats,
  DataProvider,
  ListingFilters,
} from "./types"

function clone<T>(value: T): T {
  return structuredClone(value)
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function matchesSearch(value: string | null | undefined, search: string): boolean {
  if (!value) return false
  return value.toLowerCase().includes(search.toLowerCase())
}

class MockDataStore {
  businessSpaces = clone(BUSINESS_SPACES)
  users = clone(USERS)
  clients = clone(CLIENTS)
  listings = clone(LISTINGS)
  activityEvents = clone(ACTIVITY_EVENTS)
}

const globalStore = globalThis as typeof globalThis & {
  __autocoreMockStore?: MockDataStore
}

function getStore(): MockDataStore {
  if (!globalStore.__autocoreMockStore) {
    globalStore.__autocoreMockStore = new MockDataStore()
  }
  return globalStore.__autocoreMockStore
}

function addActivity(
  store: MockDataStore,
  businessSpaceId: string,
  type: ActivityEvent["type"],
  description: string
) {
  store.activityEvents.unshift({
    id: generateId("activity"),
    businessSpaceId,
    type,
    description,
    createdAt: new Date().toISOString(),
  })
}

export const mockProvider: DataProvider = {
  async getBusinessSpace(businessSpaceId) {
    const store = getStore()
    return store.businessSpaces.find((s) => s.id === businessSpaceId) ?? null
  },

  async getUsers(businessSpaceId) {
    const store = getStore()
    return store.users.filter(
      (u) => u.businessSpaceId === businessSpaceId && u.isActive
    )
  },

  async getClients(businessSpaceId, filters = {}) {
    const store = getStore()
    let results = store.clients.filter(
      (c) =>
        c.businessSpaceId === businessSpaceId &&
        (filters.includeArchived || !c.isArchived)
    )

    if (filters.search) {
      const search = filters.search.trim()
      results = results.filter(
        (c) =>
          matchesSearch(c.fullName, search) ||
          matchesSearch(c.email, search) ||
          matchesSearch(c.phone, search)
      )
    }

    return results.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  },

  async getClient(businessSpaceId, clientId) {
    const store = getStore()
    return (
      store.clients.find(
        (c) => c.businessSpaceId === businessSpaceId && c.id === clientId
      ) ?? null
    )
  },

  async createClient(businessSpaceId, userId, input) {
    const store = getStore()
    const now = new Date().toISOString()
    const client: Client = {
      id: generateId("client"),
      businessSpaceId,
      fullName: input.fullName,
      email: input.email || null,
      phone: input.phone || null,
      address: input.address || null,
      notes: input.notes || null,
      isArchived: false,
      createdById: userId,
      createdAt: now,
      updatedAt: now,
    }
    store.clients.unshift(client)
    addActivity(
      store,
      businessSpaceId,
      "CLIENT_CREATED",
      `New client ${client.fullName} added`
    )
    return client
  },

  async updateClient(businessSpaceId, clientId, input) {
    const store = getStore()
    const index = store.clients.findIndex(
      (c) => c.businessSpaceId === businessSpaceId && c.id === clientId
    )
    if (index === -1) return null

    const existing = store.clients[index]
    const updated: Client = {
      ...existing,
      fullName: input.fullName ?? existing.fullName,
      email: input.email !== undefined ? input.email || null : existing.email,
      phone: input.phone !== undefined ? input.phone || null : existing.phone,
      address:
        input.address !== undefined ? input.address || null : existing.address,
      notes: input.notes !== undefined ? input.notes || null : existing.notes,
      updatedAt: new Date().toISOString(),
    }
    store.clients[index] = updated
    return updated
  },

  async archiveClient(businessSpaceId, clientId) {
    const store = getStore()
    const client = store.clients.find(
      (c) => c.businessSpaceId === businessSpaceId && c.id === clientId
    )
    if (!client) return false
    client.isArchived = true
    client.updatedAt = new Date().toISOString()
    return true
  },

  async getListings(businessSpaceId, filters = {}) {
    const store = getStore()
    let results = store.listings.filter(
      (l) =>
        l.businessSpaceId === businessSpaceId &&
        (filters.includeArchived || !l.isArchived)
    )

    if (filters.status) {
      results = results.filter((l) => l.status === filters.status)
    }

    if (filters.search) {
      const search = filters.search.trim()
      results = results.filter(
        (l) =>
          matchesSearch(l.title, search) ||
          matchesSearch(l.make, search) ||
          matchesSearch(l.model, search)
      )
    }

    return results.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  },

  async getListing(businessSpaceId, listingId) {
    const store = getStore()
    return (
      store.listings.find(
        (l) => l.businessSpaceId === businessSpaceId && l.id === listingId
      ) ?? null
    )
  },

  async createListing(businessSpaceId, userId, input) {
    const store = getStore()
    const now = new Date().toISOString()
    const listing: Listing = {
      id: generateId("listing"),
      businessSpaceId,
      title: input.title,
      make: input.make,
      model: input.model,
      year: input.year,
      vin: input.vin || null,
      colour: input.colour || null,
      mileage: input.mileage ?? null,
      fuelType: input.fuelType ?? null,
      transmission: input.transmission ?? null,
      condition: input.condition ?? null,
      price: input.price ?? null,
      status: input.status ?? "AVAILABLE",
      description: input.description || null,
      images: [],
      isArchived: false,
      clientId: input.clientId || null,
      createdById: userId,
      createdAt: now,
      updatedAt: now,
    }
    store.listings.unshift(listing)
    addActivity(
      store,
      businessSpaceId,
      "LISTING_CREATED",
      `${listing.title} listing created`
    )
    return listing
  },

  async updateListing(businessSpaceId, listingId, input) {
    const store = getStore()
    const index = store.listings.findIndex(
      (l) => l.businessSpaceId === businessSpaceId && l.id === listingId
    )
    if (index === -1) return null

    const existing = store.listings[index]
    const newStatus = input.status ?? existing.status
    const updated: Listing = {
      ...existing,
      title: input.title ?? existing.title,
      make: input.make ?? existing.make,
      model: input.model ?? existing.model,
      year: input.year ?? existing.year,
      vin: input.vin !== undefined ? input.vin || null : existing.vin,
      colour:
        input.colour !== undefined ? input.colour || null : existing.colour,
      mileage: input.mileage ?? existing.mileage,
      fuelType: input.fuelType ?? existing.fuelType,
      transmission: input.transmission ?? existing.transmission,
      condition: input.condition ?? existing.condition,
      price: input.price ?? existing.price,
      status: newStatus,
      description:
        input.description !== undefined
          ? input.description || null
          : existing.description,
      clientId:
        input.clientId !== undefined
          ? input.clientId || null
          : existing.clientId,
      updatedAt: new Date().toISOString(),
    }

    if (newStatus !== existing.status) {
      addActivity(
        store,
        businessSpaceId,
        "LISTING_STATUS_CHANGED",
        `${updated.title} marked as ${newStatus}`
      )
    }

    store.listings[index] = updated
    return updated
  },

  async archiveListing(businessSpaceId, listingId) {
    const store = getStore()
    const listing = store.listings.find(
      (l) => l.businessSpaceId === businessSpaceId && l.id === listingId
    )
    if (!listing) return false
    listing.isArchived = true
    listing.updatedAt = new Date().toISOString()
    return true
  },

  async getActivityEvents(businessSpaceId, limit = 10) {
    const store = getStore()
    return store.activityEvents
      .filter((e) => e.businessSpaceId === businessSpaceId)
      .slice(0, limit)
  },

  async getDashboardStats(businessSpaceId) {
    const store = getStore()
    const space =
      store.businessSpaces.find((s) => s.id === businessSpaceId) ?? null
    if (!space) {
      throw new Error("Business space not found")
    }

    const clients = store.clients.filter(
      (c) => c.businessSpaceId === businessSpaceId && !c.isArchived
    )
    const listings = store.listings.filter(
      (l) => l.businessSpaceId === businessSpaceId && !l.isArchived
    )

    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
    const newClientsLast30Days = clients.filter(
      (c) => new Date(c.createdAt).getTime() >= thirtyDaysAgo
    ).length

    const listingsByStatus: Record<ListingStatus, number> = {
      AVAILABLE: 0,
      RESERVED: 0,
      SOLD: 0,
      RENTED: 0,
    }
    for (const listing of listings) {
      listingsByStatus[listing.status]++
    }

    const stats: DashboardStats = {
      totalClients: clients.length,
      newClientsLast30Days,
      totalListings: listings.length,
      listingsByStatus,
      seatLimit: space.seatLimit,
      seatsUsed: space.seatsUsed,
    }

    if (space.nature === "SECOND_HAND_DEALER") {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)
      stats.soldThisMonth = listings.filter(
        (l) =>
          l.status === "SOLD" &&
          new Date(l.updatedAt).getTime() >= startOfMonth.getTime()
      ).length
      stats.reservedCount = listingsByStatus.RESERVED
    }

    if (space.nature === "LUXURY_CAR_RENTAL") {
      stats.currentlyRented = listingsByStatus.RENTED
      stats.availableFleet = listingsByStatus.AVAILABLE
      stats.revenueMtd = listings
        .filter((l) => l.status === "RENTED" && l.price)
        .reduce((sum, l) => sum + (l.price ?? 0) * 15, 0)
    }

    return stats
  },
}

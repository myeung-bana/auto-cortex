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
import type {
  ClientFilters,
  DashboardStats,
  DataProvider,
  ListingFilters,
} from "./types"
import {
  countSeatsUsed,
  generateId,
  getMemoryStore,
  type MemoryStore,
} from "./memory-store"

function matchesSearch(value: string | null | undefined, search: string): boolean {
  if (!value) return false
  return value.toLowerCase().includes(search.toLowerCase())
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function addActivity(
  store: MemoryStore,
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
    const store = getMemoryStore()
    const space = store.businessSpaces.find((s) => s.id === businessSpaceId)
    if (!space) return null
    return { ...space, seatsUsed: countSeatsUsed(store, space.id) }
  },

  async getUsers(businessSpaceId) {
    const store = getMemoryStore()
    return store.users.filter(
      (u) => u.businessSpaceId === businessSpaceId && u.isActive
    )
  },

  async getClients(businessSpaceId, filters = {}) {
    const store = getMemoryStore()
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
    const store = getMemoryStore()
    return (
      store.clients.find(
        (c) => c.businessSpaceId === businessSpaceId && c.id === clientId
      ) ?? null
    )
  },

  async createClient(businessSpaceId, userId, input) {
    const store = getMemoryStore()
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
    const store = getMemoryStore()
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
    const store = getMemoryStore()
    const client = store.clients.find(
      (c) => c.businessSpaceId === businessSpaceId && c.id === clientId
    )
    if (!client) return false
    client.isArchived = true
    client.updatedAt = new Date().toISOString()
    return true
  },

  async getListings(businessSpaceId, filters = {}) {
    const store = getMemoryStore()
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
    const store = getMemoryStore()
    return (
      store.listings.find(
        (l) => l.businessSpaceId === businessSpaceId && l.id === listingId
      ) ?? null
    )
  },

  async createListing(businessSpaceId, userId, input) {
    const store = getMemoryStore()
    const now = new Date().toISOString()
    const listing: Listing = {
      id: generateId("listing"),
      businessSpaceId,
      slug: slugify(input.title) || generateId("listing"),
      title: input.title,
      make: input.make,
      model: input.model,
      variant: input.variant || null,
      year: input.year,
      bodyType: input.bodyType || null,
      transmission: input.transmission || null,
      fuelType: input.fuelType || null,
      exteriorColor: input.exteriorColor || null,
      interiorColor: input.interiorColor || null,
      price:
        input.price != null
          ? { amount: input.price, currency: "HKD" }
          : null,
      mileage:
        input.mileage != null
          ? { value: input.mileage, unit: "km" }
          : null,
      engineCc: input.engineCc ?? null,
      seats: input.seats ?? null,
      doors: input.doors ?? null,
      features: input.features ?? [],
      images: [],
      description: input.description || null,
      status: input.status ?? "AVAILABLE",
      vin: input.vin || null,
      clientId: null,
      isArchived: false,
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
    const store = getMemoryStore()
    const index = store.listings.findIndex(
      (l) => l.businessSpaceId === businessSpaceId && l.id === listingId
    )
    if (index === -1) return null

    const existing = store.listings[index]
    const newStatus = input.status ?? existing.status
    const updated: Listing = {
      ...existing,
      title: input.title ?? existing.title,
      slug: input.title ? slugify(input.title) : existing.slug,
      make: input.make ?? existing.make,
      model: input.model ?? existing.model,
      variant:
        input.variant !== undefined ? input.variant || null : existing.variant,
      year: input.year ?? existing.year,
      bodyType:
        input.bodyType !== undefined
          ? input.bodyType || null
          : existing.bodyType,
      transmission:
        input.transmission !== undefined
          ? input.transmission || null
          : existing.transmission,
      fuelType:
        input.fuelType !== undefined
          ? input.fuelType || null
          : existing.fuelType,
      exteriorColor:
        input.exteriorColor !== undefined
          ? input.exteriorColor || null
          : existing.exteriorColor,
      interiorColor:
        input.interiorColor !== undefined
          ? input.interiorColor || null
          : existing.interiorColor,
      price:
        input.price !== undefined
          ? input.price != null
            ? { amount: input.price, currency: existing.price?.currency ?? "HKD" }
            : null
          : existing.price,
      mileage:
        input.mileage !== undefined
          ? input.mileage != null
            ? { value: input.mileage, unit: "km" }
            : null
          : existing.mileage,
      engineCc: input.engineCc !== undefined ? input.engineCc ?? null : existing.engineCc,
      seats: input.seats !== undefined ? input.seats ?? null : existing.seats,
      doors: input.doors !== undefined ? input.doors ?? null : existing.doors,
      features: input.features ?? existing.features,
      vin: input.vin !== undefined ? input.vin || null : existing.vin,
      status: newStatus,
      description:
        input.description !== undefined
          ? input.description || null
          : existing.description,
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

  async patchListing(businessSpaceId, listingId, patch) {
    const store = getMemoryStore()
    const listing = store.listings.find(
      (item) => item.businessSpaceId === businessSpaceId && item.id === listingId
    )
    if (!listing) return null

    if (patch.images !== undefined) listing.images = patch.images
    if (patch.price !== undefined) listing.price = patch.price
    if (patch.year !== undefined) listing.year = patch.year
    if (patch.mileage !== undefined) {
      listing.mileage =
        patch.mileage == null
          ? null
          : { value: patch.mileage, unit: listing.mileage?.unit ?? "km" }
    }
    if (patch.transmission !== undefined) listing.transmission = patch.transmission
    if (patch.make !== undefined) listing.make = patch.make
    if (patch.bodyType !== undefined) listing.bodyType = patch.bodyType
    if (patch.fuelType !== undefined) listing.fuelType = patch.fuelType
    if (patch.engineCc !== undefined) listing.engineCc = patch.engineCc
    if (patch.exteriorColor !== undefined) listing.exteriorColor = patch.exteriorColor
    if (patch.interiorColor !== undefined) listing.interiorColor = patch.interiorColor
    if (patch.seats !== undefined) listing.seats = patch.seats
    if (patch.doors !== undefined) listing.doors = patch.doors
    if (patch.features !== undefined) listing.features = patch.features
    listing.updatedAt = new Date().toISOString()
    return listing
  },

  async archiveListing(businessSpaceId, listingId) {
    const store = getMemoryStore()
    const listing = store.listings.find(
      (l) => l.businessSpaceId === businessSpaceId && l.id === listingId
    )
    if (!listing) return false
    listing.isArchived = true
    listing.updatedAt = new Date().toISOString()
    return true
  },

  async getActivityEvents(businessSpaceId, limit = 10) {
    const store = getMemoryStore()
    return store.activityEvents
      .filter((e) => e.businessSpaceId === businessSpaceId)
      .slice(0, limit)
  },

  async getDashboardStats(businessSpaceId) {
    const store = getMemoryStore()
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
      seatsUsed: countSeatsUsed(store, space.id),
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
        .reduce((sum, l) => sum + (l.price?.amount ?? 0) * 15, 0)
    }

    return stats
  },
}

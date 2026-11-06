import type { BusinessSpace, User } from "@autocore/utils"
import {
  countSeatsUsed,
  generateId,
  getMemoryStore,
  type MemoryStore,
} from "../data/memory-store"
import type {
  CreateSpaceInput,
  PlatformEvent,
  PlatformEventType,
  PlatformSpace,
  SpaceInput,
} from "./types"

export type { CreateSpaceInput, PlatformSpace, SpaceInput }

function addPlatformEvent(
  store: MemoryStore,
  type: PlatformEventType,
  businessSpaceId: string,
  description: string
) {
  store.platformEvents.unshift({
    id: generateId("platform"),
    type,
    businessSpaceId,
    description,
    createdAt: new Date().toISOString(),
  })
}

function toPlatformSpace(store: MemoryStore, space: BusinessSpace): PlatformSpace {
  const owner = store.users.find(
    (user) =>
      user.businessSpaceId === space.id && user.role === "BUSINESS_OWNER"
  )
  return {
    ...space,
    seatsUsed: countSeatsUsed(store, space.id),
    ownerName: owner?.displayName ?? null,
    listingCount: store.listings.filter(
      (listing) => listing.businessSpaceId === space.id && !listing.isArchived
    ).length,
  }
}

export function listPlatformSpaces(): PlatformSpace[] {
  const store = getMemoryStore()
  return [...store.businessSpaces]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((space) => toPlatformSpace(store, space))
}

export function getPlatformSpace(id: string): PlatformSpace | null {
  const store = getMemoryStore()
  const space = store.businessSpaces.find((item) => item.id === id)
  return space ? toPlatformSpace(store, space) : null
}

export function getPlatformOverview() {
  const store = getMemoryStore()
  return {
    activeSpaces: store.businessSpaces.filter((space) => space.isActive).length,
    suspendedSpaces: store.businessSpaces.filter((space) => !space.isActive)
      .length,
    totalUsers: store.users.filter((user) => user.isActive).length,
    totalListings: store.listings.filter((listing) => !listing.isArchived)
      .length,
  }
}

export function listPlatformEvents(limit = 10): PlatformEvent[] {
  return getMemoryStore().platformEvents.slice(0, limit)
}

function validateSpace(input: SpaceInput): string | null {
  if (!input.name.trim()) return "Space name is required"
  if (!Number.isInteger(input.seatLimit) || input.seatLimit < 1) {
    return "Seat limit must be at least 1"
  }
  return null
}

export function createPlatformSpace(input: CreateSpaceInput) {
  const store = getMemoryStore()
  const invalid = validateSpace(input)
  if (invalid) return { error: invalid }
  if (!input.ownerName.trim()) return { error: "Owner name is required" }

  const email = input.ownerEmail.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid owner email" }
  }
  if (store.users.some((user) => user.email.toLowerCase() === email)) {
    return { error: "A user with this email already exists" }
  }

  const now = new Date().toISOString()
  const space: BusinessSpace = {
    id: generateId("space"),
    name: input.name.trim(),
    nature: input.nature,
    seatLimit: input.seatLimit,
    seatsUsed: 1,
    isActive: true,
    createdAt: now,
  }
  const owner: User = {
    id: generateId("user"),
    businessSpaceId: space.id,
    role: "BUSINESS_OWNER",
    displayName: input.ownerName.trim(),
    email,
    isActive: true,
    createdAt: now,
  }

  store.businessSpaces.push(space)
  store.users.push(owner)
  addPlatformEvent(
    store,
    "SPACE_CREATED",
    space.id,
    `${space.name} was created with owner ${owner.displayName}`
  )
  return { space }
}

export function updatePlatformSpace(id: string, input: SpaceInput) {
  const store = getMemoryStore()
  const space = store.businessSpaces.find((item) => item.id === id)
  if (!space) return { error: "Business Space not found" }

  const invalid = validateSpace(input)
  if (invalid) return { error: invalid }

  const seatsUsed = countSeatsUsed(store, id)
  if (input.seatLimit < seatsUsed) {
    return {
      error: `Seat limit cannot be lower than the ${seatsUsed} seats in use`,
    }
  }

  space.name = input.name.trim()
  space.nature = input.nature
  space.seatLimit = input.seatLimit
  addPlatformEvent(store, "SPACE_UPDATED", id, `${space.name} was updated`)
  return { space }
}

export function setPlatformSpaceActive(id: string, isActive: boolean) {
  const store = getMemoryStore()
  const space = store.businessSpaces.find((item) => item.id === id)
  if (!space) return
  space.isActive = isActive
  addPlatformEvent(
    store,
    isActive ? "SPACE_RESTORED" : "SPACE_SUSPENDED",
    id,
    `${space.name} was ${isActive ? "restored" : "suspended"}`
  )
}

export function deletePlatformSpace(id: string) {
  const store = getMemoryStore()
  const space = store.businessSpaces.find((item) => item.id === id)
  if (!space) return

  store.businessSpaces = store.businessSpaces.filter((item) => item.id !== id)
  store.users = store.users.filter((user) => user.businessSpaceId !== id)
  store.clients = store.clients.filter((client) => client.businessSpaceId !== id)
  store.listings = store.listings.filter(
    (listing) => listing.businessSpaceId !== id
  )
  store.activityEvents = store.activityEvents.filter(
    (event) => event.businessSpaceId !== id
  )
  addPlatformEvent(store, "SPACE_DELETED", id, `${space.name} was deleted`)
}

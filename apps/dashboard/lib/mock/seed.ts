import type { ActivityEvent } from "@autocore/utils"
import { CLIENTS } from "./fixtures/clients"
import { LISTINGS } from "./fixtures/listings"
import { BUSINESS_SPACES } from "./fixtures/business-spaces"
import { USERS } from "./fixtures/users"

export { BUSINESS_SPACES, USERS, CLIENTS, LISTINGS }

export const ACTIVITY_EVENTS: ActivityEvent[] = [
  {
    id: "activity-1",
    businessSpaceId: "vins-motors",
    type: "LISTING_STATUS_CHANGED",
    description: "Mercedes-Benz GLE marked as Reserved for Jennifer Walsh",
    createdAt: "2026-05-18T14:00:00Z",
  },
  {
    id: "activity-2",
    businessSpaceId: "vins-motors",
    type: "CLIENT_CREATED",
    description: "New client Amanda Foster added",
    createdAt: "2026-05-20T10:30:00Z",
  },
  {
    id: "activity-3",
    businessSpaceId: "vins-motors",
    type: "LISTING_CREATED",
    description: "2022 Toyota RAV4 listing created",
    createdAt: "2026-05-01T08:00:00Z",
  },
  {
    id: "activity-4",
    businessSpaceId: "vins-motors",
    type: "LISTING_STATUS_CHANGED",
    description: "2019 Audi A4 marked as Sold to David Kim",
    createdAt: "2026-05-15T16:45:00Z",
  },
  {
    id: "activity-5",
    businessSpaceId: "prestige-rentals",
    type: "LISTING_STATUS_CHANGED",
    description: "Porsche 911 Carrera rented to Robert Sterling",
    createdAt: "2026-05-25T09:00:00Z",
  },
  {
    id: "activity-6",
    businessSpaceId: "prestige-rentals",
    type: "LISTING_STATUS_CHANGED",
    description: "Range Rover Sport rented to Isabella Montenegro",
    createdAt: "2026-05-28T11:00:00Z",
  },
  {
    id: "activity-7",
    businessSpaceId: "prestige-rentals",
    type: "CLIENT_CREATED",
    description: "New client Thomas Wright added — corporate account",
    createdAt: "2026-02-10T15:30:00Z",
  },
]

export function getSeedData() {
  return {
    businessSpaces: BUSINESS_SPACES,
    users: USERS,
    clients: CLIENTS,
    listings: LISTINGS,
    activityEvents: ACTIVITY_EVENTS,
  }
}

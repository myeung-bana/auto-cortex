import type { BusinessSpace } from "@autocore/utils"

export const BUSINESS_SPACES: BusinessSpace[] = [
  {
    id: "vins-motors",
    name: "Vins Motors",
    nature: "SECOND_HAND_DEALER",
    seatLimit: 5,
    seatsUsed: 3,
    isActive: true,
    createdAt: "2025-11-01T10:00:00Z",
  },
  {
    id: "prestige-rentals",
    name: "Prestige Rentals",
    nature: "LUXURY_CAR_RENTAL",
    seatLimit: 8,
    seatsUsed: 4,
    isActive: true,
    createdAt: "2025-09-15T08:00:00Z",
  },
]

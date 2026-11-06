import type { BusinessNature, BusinessSpace } from "@autocore/utils"

export interface SpaceInput {
  name: string
  nature: BusinessNature
  seatLimit: number
}

export interface CreateSpaceInput extends SpaceInput {
  ownerName: string
  ownerEmail: string
}

export interface PlatformSpace extends BusinessSpace {
  ownerName: string | null
  listingCount: number
}

export interface MasterSession {
  id: string
  displayName: string
  email: string
}

export type PlatformEventType =
  | "SPACE_CREATED"
  | "SPACE_UPDATED"
  | "SPACE_SUSPENDED"
  | "SPACE_RESTORED"
  | "SPACE_DELETED"

export interface PlatformEvent {
  id: string
  type: PlatformEventType
  businessSpaceId: string
  description: string
  createdAt: string
}

export interface ActionResult {
  error?: string
}

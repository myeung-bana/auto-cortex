export type BusinessNature = "SECOND_HAND_DEALER" | "LUXURY_CAR_RENTAL"

export type UserRole = "BUSINESS_OWNER" | "USER"

export type FuelType = "PETROL" | "DIESEL" | "ELECTRIC" | "HYBRID"

export type Transmission = "AUTOMATIC" | "MANUAL"

export type VehicleCondition = "NEW" | "USED" | "CERTIFIED_PRE_OWNED"

export type ListingStatus = "AVAILABLE" | "RESERVED" | "SOLD" | "RENTED"

export interface BusinessSpace {
  id: string
  name: string
  nature: BusinessNature
  seatLimit: number
  seatsUsed: number
  isActive: boolean
  createdAt: string
}

export interface User {
  id: string
  businessSpaceId: string
  role: UserRole
  displayName: string
  email: string
  isActive: boolean
  createdAt: string
}

export interface Client {
  id: string
  businessSpaceId: string
  fullName: string
  email: string | null
  phone: string | null
  address: string | null
  notes: string | null
  isArchived: boolean
  createdById: string | null
  createdAt: string
  updatedAt: string
}

export interface Listing {
  id: string
  businessSpaceId: string
  title: string
  make: string
  model: string
  year: number
  vin: string | null
  colour: string | null
  mileage: number | null
  fuelType: FuelType | null
  transmission: Transmission | null
  condition: VehicleCondition | null
  price: number | null
  status: ListingStatus
  description: string | null
  images: string[]
  isArchived: boolean
  clientId: string | null
  createdById: string | null
  createdAt: string
  updatedAt: string
}

export interface ActivityEvent {
  id: string
  businessSpaceId: string
  type: "CLIENT_CREATED" | "LISTING_CREATED" | "LISTING_STATUS_CHANGED"
  description: string
  createdAt: string
}

export const BUSINESS_NATURE_LABELS: Record<BusinessNature, string> = {
  SECOND_HAND_DEALER: "Second-Hand Dealer",
  LUXURY_CAR_RENTAL: "Luxury Car Rental",
}

export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  AVAILABLE: "Available",
  RESERVED: "Reserved",
  SOLD: "Sold",
  RENTED: "Rented",
}

export const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  PETROL: "Petrol",
  DIESEL: "Diesel",
  ELECTRIC: "Electric",
  HYBRID: "Hybrid",
}

export const TRANSMISSION_LABELS: Record<Transmission, string> = {
  AUTOMATIC: "Automatic",
  MANUAL: "Manual",
}

export const CONDITION_LABELS: Record<VehicleCondition, string> = {
  NEW: "New",
  USED: "Used",
  CERTIFIED_PRE_OWNED: "Certified Pre-Owned",
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  BUSINESS_OWNER: "Business Owner",
  USER: "User",
}

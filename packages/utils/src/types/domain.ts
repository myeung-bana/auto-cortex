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

export interface ListingImage {
  position: number
  isCover: boolean
  storageFileId: string | null
  sourceUrl: string
}

export interface ListingMoney {
  amount: number
  currency: string
}

export interface ListingMileage {
  value: number
  unit: string
}

export interface Listing {
  id: string
  businessSpaceId: string
  slug: string
  title: string
  make: string
  model: string
  variant: string | null
  year: number
  bodyType: string | null
  transmission: string | null
  fuelType: string | null
  exteriorColor: string | null
  interiorColor: string | null
  price: ListingMoney | null
  mileage: ListingMileage | null
  engineCc: number | null
  seats: number | null
  doors: number | null
  features: string[]
  images: ListingImage[]
  description: string | null
  status: ListingStatus
  vin: string | null
  clientId: string | null
  isArchived: boolean
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

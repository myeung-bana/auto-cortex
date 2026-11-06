import type {
  ActivityEvent,
  BusinessSpace,
  Client,
  CreateClientInput,
  CreateListingInput,
  Listing,
  ListingImage,
  ListingMoney,
  ListingStatus,
  User,
} from "@autocore/utils"

export interface ClientFilters {
  search?: string
  includeArchived?: boolean
}

export interface ListingFilters {
  search?: string
  status?: ListingStatus
  includeArchived?: boolean
}

export interface ListingPatch {
  images?: ListingImage[]
  price?: ListingMoney | null
  year?: number
  mileage?: number | null
  transmission?: string | null
  make?: string
  bodyType?: string | null
  fuelType?: string | null
  engineCc?: number | null
  exteriorColor?: string | null
  interiorColor?: string | null
  seats?: number | null
  doors?: number | null
  features?: string[]
}

export interface DashboardStats {
  totalClients: number
  newClientsLast30Days: number
  totalListings: number
  listingsByStatus: Record<ListingStatus, number>
  seatLimit: number
  seatsUsed: number
  soldThisMonth?: number
  reservedCount?: number
  currentlyRented?: number
  availableFleet?: number
  revenueMtd?: number
}

export interface DataProvider {
  getBusinessSpace(businessSpaceId: string): Promise<BusinessSpace | null>
  getUsers(businessSpaceId: string): Promise<User[]>
  getClients(
    businessSpaceId: string,
    filters?: ClientFilters
  ): Promise<Client[]>
  getClient(businessSpaceId: string, clientId: string): Promise<Client | null>
  createClient(
    businessSpaceId: string,
    userId: string,
    input: CreateClientInput
  ): Promise<Client>
  updateClient(
    businessSpaceId: string,
    clientId: string,
    input: Partial<CreateClientInput>
  ): Promise<Client | null>
  archiveClient(businessSpaceId: string, clientId: string): Promise<boolean>
  getListings(
    businessSpaceId: string,
    filters?: ListingFilters
  ): Promise<Listing[]>
  getListing(
    businessSpaceId: string,
    listingId: string
  ): Promise<Listing | null>
  createListing(
    businessSpaceId: string,
    userId: string,
    input: CreateListingInput
  ): Promise<Listing>
  updateListing(
    businessSpaceId: string,
    listingId: string,
    input: Partial<CreateListingInput>
  ): Promise<Listing | null>
  patchListing(
    businessSpaceId: string,
    listingId: string,
    patch: ListingPatch
  ): Promise<Listing | null>
  archiveListing(businessSpaceId: string, listingId: string): Promise<boolean>
  getActivityEvents(
    businessSpaceId: string,
    limit?: number
  ): Promise<ActivityEvent[]>
  getDashboardStats(businessSpaceId: string): Promise<DashboardStats>
}

export type { CreateClientInput, CreateListingInput }

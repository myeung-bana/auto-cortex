"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getDataProvider } from "../data"
import { ROUTES } from "../constants/routes"
import { getSessionUser } from "../session"
import type { CreateListingInput, ListingImage, ListingMoney } from "@autocore/utils"
import type { ListingPatch } from "../data/types"

export async function createListingAction(input: CreateListingInput) {
  const user = await getSessionUser()
  if (!user) redirect(ROUTES.login)

  const provider = getDataProvider()
  const listing = await provider.createListing(
    user.businessSpaceId,
    user.id,
    input
  )

  revalidatePath(ROUTES.listings)
  revalidatePath(ROUTES.dashboard)
  redirect(ROUTES.listingDetail(listing.id))
}

export async function updateListingAction(
  listingId: string,
  input: CreateListingInput
) {
  const user = await getSessionUser()
  if (!user) redirect(ROUTES.login)

  const provider = getDataProvider()
  await provider.updateListing(user.businessSpaceId, listingId, input)

  revalidatePath(ROUTES.listings)
  revalidatePath(ROUTES.listingDetail(listingId))
  redirect(ROUTES.listingDetail(listingId))
}

async function saveSection(listingId: string, patch: ListingPatch) {
  const user = await getSessionUser()
  if (!user) redirect(ROUTES.login)

  const provider = getDataProvider()
  const listing = await provider.patchListing(
    user.businessSpaceId,
    listingId,
    patch
  )
  if (!listing) redirect(ROUTES.listings)

  revalidatePath(ROUTES.listings)
  revalidatePath(ROUTES.listingDetail(listingId))
  revalidatePath(`/listings/${listingId}/edit`, "layout")
}

export async function saveListingGalleryAction(
  listingId: string,
  images: ListingImage[]
) {
  await saveSection(listingId, { images })
}

export async function saveListingPricingAction(
  listingId: string,
  price: ListingMoney
) {
  await saveSection(listingId, { price })
}

export async function saveListingDetailsAction(
  listingId: string,
  patch: Omit<ListingPatch, "images" | "price" | "features">
) {
  await saveSection(listingId, patch)
}

export async function saveListingFeaturesAction(
  listingId: string,
  features: string[]
) {
  await saveSection(listingId, { features })
}

export async function archiveListingAction(listingId: string) {
  const user = await getSessionUser()
  if (!user) redirect(ROUTES.login)

  const provider = getDataProvider()
  await provider.archiveListing(user.businessSpaceId, listingId)

  revalidatePath(ROUTES.listings)
  revalidatePath(ROUTES.dashboard)
  redirect(ROUTES.listings)
}

"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getDataProvider } from "../data"
import { ROUTES } from "../constants/routes"
import { getSessionUser } from "../session/mock-session"
import type { CreateListingInput } from "@autocore/utils"

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

export async function archiveListingAction(listingId: string) {
  const user = await getSessionUser()
  if (!user) redirect(ROUTES.login)

  const provider = getDataProvider()
  await provider.archiveListing(user.businessSpaceId, listingId)

  revalidatePath(ROUTES.listings)
  revalidatePath(ROUTES.dashboard)
  redirect(ROUTES.listings)
}

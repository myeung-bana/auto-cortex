"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getDataProvider } from "../data"
import { ROUTES } from "../constants/routes"
import { getSessionUser } from "../session/mock-session"
import type { CreateClientInput } from "@autocore/utils"

export async function createClientAction(input: CreateClientInput) {
  const user = await getSessionUser()
  if (!user) redirect(ROUTES.login)

  const provider = getDataProvider()
  const client = await provider.createClient(
    user.businessSpaceId,
    user.id,
    input
  )

  revalidatePath(ROUTES.clients)
  revalidatePath(ROUTES.dashboard)
  redirect(ROUTES.clientDetail(client.id))
}

export async function updateClientAction(
  clientId: string,
  input: CreateClientInput
) {
  const user = await getSessionUser()
  if (!user) redirect(ROUTES.login)

  const provider = getDataProvider()
  await provider.updateClient(user.businessSpaceId, clientId, input)

  revalidatePath(ROUTES.clients)
  revalidatePath(ROUTES.clientDetail(clientId))
  redirect(ROUTES.clientDetail(clientId))
}

export async function archiveClientAction(clientId: string) {
  const user = await getSessionUser()
  if (!user) redirect(ROUTES.login)

  const provider = getDataProvider()
  await provider.archiveClient(user.businessSpaceId, clientId)

  revalidatePath(ROUTES.clients)
  revalidatePath(ROUTES.dashboard)
  redirect(ROUTES.clients)
}

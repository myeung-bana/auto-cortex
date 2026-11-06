"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ROUTES } from "../constants/routes"
import { getSessionUser } from "../session"
import { getTaxonomyConfig, isTaxonomyKey } from "../taxonomies/registry"
import {
  createTaxonomyRecord,
  removeTaxonomyRecord,
  updateTaxonomyRecord,
} from "../taxonomies/provider"
import type { TaxonomyInput } from "../taxonomies/types"

function taxonomyPath(key: string) {
  return `/taxonomies/${key}`
}

async function requireUser() {
  const user = await getSessionUser()
  if (!user) redirect(ROUTES.login)
  return user
}

function failure(error: unknown) {
  return { error: error instanceof Error ? error.message : "Failed to save" }
}

export async function saveTaxonomyAction(key: string, input: TaxonomyInput) {
  await requireUser()
  if (!isTaxonomyKey(key)) redirect(ROUTES.dashboard)
  let recordId: string
  try {
    recordId = (await createTaxonomyRecord(key, input)).id
  } catch (error) {
    return failure(error)
  }
  revalidatePath(taxonomyPath(key))
  redirect(`${taxonomyPath(key)}/${recordId}/edit`)
}

export async function updateTaxonomyAction(
  key: string,
  id: string,
  input: TaxonomyInput
) {
  await requireUser()
  if (!isTaxonomyKey(key)) redirect(ROUTES.dashboard)
  try {
    await updateTaxonomyRecord(key, id, input)
  } catch (error) {
    return failure(error)
  }
  revalidatePath(taxonomyPath(key))
  redirect(taxonomyPath(key))
}

export async function removeTaxonomyAction(key: string, id: string) {
  await requireUser()
  if (!isTaxonomyKey(key) || !getTaxonomyConfig(key)) redirect(ROUTES.dashboard)
  await removeTaxonomyRecord(key, id)
  revalidatePath(taxonomyPath(key))
  redirect(taxonomyPath(key))
}

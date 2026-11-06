"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { errorMessage } from "../api/errors"
import { ROUTES } from "../constants/routes"
import {
  createSpace,
  deleteSpace,
  setSpaceActive,
  updateSpace,
  type MutationResult,
} from "../master/provider"
import type { ActionResult, CreateSpaceInput, SpaceInput } from "../master/types"
import { getMasterSession } from "../session"

async function requireMaster() {
  const admin = await getMasterSession()
  if (!admin) redirect(ROUTES.masterLogin)
}

function revalidateMaster() {
  revalidatePath(ROUTES.masterConsole, "layout")
  revalidatePath(ROUTES.login)
}

async function attempt(run: () => Promise<MutationResult>): Promise<MutationResult> {
  try {
    return await run()
  } catch (error) {
    return { error: errorMessage(error, "The change could not be saved") }
  }
}

export async function createSpaceAction(
  input: CreateSpaceInput
): Promise<ActionResult> {
  await requireMaster()
  const result = await attempt(() => createSpace(input))
  if (result.error) return { error: result.error }
  revalidateMaster()
  redirect(ROUTES.masterSpaces)
}

export async function updateSpaceAction(
  id: string,
  input: SpaceInput
): Promise<ActionResult> {
  await requireMaster()
  const result = await attempt(() => updateSpace(id, input))
  if (result.error) return { error: result.error }
  revalidateMaster()
  redirect(ROUTES.masterSpaces)
}

export async function setSpaceActiveAction(id: string, isActive: boolean) {
  await requireMaster()
  await setSpaceActive(id, isActive)
  revalidateMaster()
}

export async function deleteSpaceAction(id: string) {
  await requireMaster()
  await deleteSpace(id)
  revalidateMaster()
}

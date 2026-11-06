import "server-only"
import { platformApi, type PlatformOverview } from "../api/platform"
import { isMockMode } from "../config"
import * as store from "./store"
import type { CreateSpaceInput, PlatformSpace, SpaceInput } from "./types"

export interface MutationResult {
  error?: string
  inviteSent?: boolean
}

export async function getOverview(eventLimit = 10): Promise<PlatformOverview> {
  if (isMockMode()) {
    return { stats: store.getPlatformOverview(), events: store.listPlatformEvents(eventLimit) }
  }
  return platformApi.overview(eventLimit)
}

export async function listSpaces(): Promise<PlatformSpace[]> {
  if (isMockMode()) return store.listPlatformSpaces()
  return platformApi.spaces.list()
}

export async function getSpace(id: string): Promise<PlatformSpace | null> {
  if (isMockMode()) return store.getPlatformSpace(id)
  return platformApi.spaces.get(id)
}

export async function createSpace(input: CreateSpaceInput): Promise<MutationResult> {
  if (isMockMode()) return { error: store.createPlatformSpace(input).error }
  const { inviteSent } = await platformApi.spaces.create(input)
  return { inviteSent }
}

export async function updateSpace(id: string, input: SpaceInput): Promise<MutationResult> {
  if (isMockMode()) return { error: store.updatePlatformSpace(id, input).error }
  await platformApi.spaces.update(id, input)
  return {}
}

export async function setSpaceActive(id: string, isActive: boolean) {
  if (isMockMode()) return store.setPlatformSpaceActive(id, isActive)
  await platformApi.spaces.setActive(id, isActive)
}

export async function deleteSpace(id: string) {
  if (isMockMode()) return store.deletePlatformSpace(id)
  await platformApi.spaces.delete(id)
}
